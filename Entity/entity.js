//entity.js
export default class Student {
    //bir sınıftan yeni bir nesne oluşturulduğunda otomatik çalışır ve nesnenin ilk   özelliklerini ayarlamak için kullanılır.
    constructor ( {id, isim, soyisim, tc_kimlik, adres}){
    this.id = id;
    this.isim = isim;
    this.soyisim = soyisim;
    this.tc_kimlik = tc_kimlik;
    this.adres = adres;
}
}

//module.exports = Student;
 //dosyada tanımlanan Student sınıfını diğer dosyalarda kullanmak üzere dışarıya açar.