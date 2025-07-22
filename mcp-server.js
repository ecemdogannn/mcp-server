// mcp-server.js
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import axios from "axios";
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

const app = express();
const port = 3001;

// JSON middleware
app.use(express.json());

// MCP server transport
const transport = new SSEServerTransport({
  path: '/mcp',
  app
});


const transports = {};

// MCP Server yaratılıyor
const mcp = new McpServer({
  name: "Task Management",
  version: "1.0.0",
  capabilities: {
    tools: {},
    resources: {},
  },
}); 

// SSE bağlantı noktası
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    delete transports[transport.sessionId];
  });

  await mcp.connect(transport);
});

// Mesajların MCP’ye iletimi
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];

  if (transport instanceof SSEServerTransport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Invalid session" },
      id: null,
    });
  }
});



// MCP araçları(tool) ve fonksiyonları(tool handlers)

mcp.tool(
  "getStudents",
  "Tüm öğrencileri getirir",
  z.object({}),
  async () => {
    try {
        const res = await axios.get("http://localhost:3000/students");
      console.log("API'den gelen veri:", res.data);  // Log ekledim
        return {
       content: [{
        type:"json",
        result:res.data
       }
       ]
      };
    } catch (err) {
      return {
        status: "error",
        message: "Öğrenciler getirilemedi: " + err.message,
      };
    }
  }
);

mcp.tool(
  "addStudent",
  "Yeni öğrenci ekler",
  {
    isim: z.string().describe("Öğrencinin ismi"),
    soyisim: z.string().describe("Öğrencinin soyismi"),
    tc_kimlik: z.string().describe("TC Kimlik Numarası"),
    adres: z.string().describe("Adres"),
  },
  async ({ isim, soyisim, tc_kimlik, adres }) => {
    try {
      await axios.post("http://localhost:3000/student", {
        isim,
        soyisim,
        tc_kimlik,
        adres,
      });

      return {
        type: "text",
        content: "Öğrenci başarıyla eklendi.",
      };
    } catch (err) {
      console.error(err);
      return {
        type: "text",
        content: `Öğrenci eklenemedi: ${err.message}`,
      };
    }
  }
);

mcp.tool(
  "getStudentById",
  "ID ile öğrenci getirir",
  {
    id: z.number().describe("Öğrenci ID'si"),
  },
  async ({ id }) => {
    try {
      const res = await axios.get(`http://localhost:3000/students/${id}`);
      return {
        type: "json",
        content: res.data,
      };
    } catch (err) {
      console.error("Öğrenci bulunamadı:", err.message);
      return {
        type: "text",
        content: "Öğrenci bulunamadı: " + err.message,
      };
    }
  }
);

mcp.tool(
  "updateStudent",
  "ID ile öğrenci günceller",
  {
    id: z.number().describe("Öğrenci ID'si"),
    isim: z.string().describe("Öğrencinin ismi"),
    soyisim: z.string().describe("Öğrencinin soyismi"),
    tc_kimlik: z.string().describe("Öğrencinin TC kimlik numarası"),
    adres: z.string().describe("Öğrencinin adresi"),
  },
  async (input) => {
    const { id, ...studentData } = input;
    try {
      const res = await axios.put(
        `http://localhost:3000/students/${id}`,
        studentData,
        { headers: { "Content-Type": "application/json" } }
      );
      return {
        type: "json",
        content: res.data,
      };
    } catch (err) {
      console.error("Öğrenci güncelleme hatası:", err.message);
      return {
        type: "text",
        content: "Öğrenci güncellenemedi: " + err.message,
      };
    }
  }
);

mcp.tool(
  "deleteStudent",
  "ID ile öğrenci siler",
  {
    id: z.number().describe("Silinecek öğrencinin benzersiz ID'si"),
  },
  async ({ id }) => {
    try {
      const res = await axios.delete(`http://localhost:3000/students/${id}`);
      console.log("Silme yanıtı:", res.data);
      return {
        content: [
          {
            type: "text",
            text: `ID'si ${id} olan öğrenci başarıyla silindi.`,
          },
        ],
      };
    } catch (err) {
      console.error("Silme hatası:", err.response?.data || err.message);
      return {
        content: [
          {
            type: "text",
            text: `Öğrenci silinemedi: ${err.response?.data?.message || err.message}`,
          },
        ],
      };
    }
  }
);


app.get('/sessions', (req, res) => {
  res.json(Object.keys(transports));
});


app.listen(port, "0.0.0.0", () => {
  console.log(`MCP Server is running on : http://host.docker.internal:${port}/mcp`);
});



