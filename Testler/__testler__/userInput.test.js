const validateUserInput = require("../utils/validateUserInput"); // testi yapılacak olan fonksiyon
// NOT:  user_type ve customer_of değerlerinin bir listeden seçileceğini varsaydım ve test kodlarına eklemedim

describe("User Input Validation", () => {
    // geçerli ve geçersiz kullanıcı inputlarını giriyoruz
    const validUser = {
        name : "Nicola",
        surname : "Tesla",
        username : "nikolaTesla",
        password: "Password123!",
        email : "nikolaTesla@gmail.com",
        phone : "05551234567",
        user_type : "customer",
        customer_of : "RND Electronic and Software"
    };
    
    const invalidUser = {
        name : null,
        surname : null,
        username : null,
        password : null,
        email : null,
        phone : null, 
        user_type : null,
        customer_of : null
    };

    // genel test kısmı 
    describe("validateUserInput function", () => {
        // valid kullanıcı inputlarının testi
        test("should return true for valid user inputs", () => {
            const result = validateUserInput(validUser);
            expect(result.isValid).toBe(true); // valid olduğu için true dönmeli
            expect(result.errors).toHaveLength(0);  // hepsi valid olduğu için error veri uzunluğu 0 olmalı
        });

        // invalid kullanıcı inputlarının testi
        test("should return false for invalid user inputs", () => {
            const result = validateUserInput(invalidUser);
            expect(result.isValid).toBe(false); // invalid eğer oldukları için false dönmeli
            expect(result.errors.length).toBeGreaterThan(0); // invalid oldukları için error var olmalı
        });

        // kullanıcıdan istenen tüm fieldlar dolu olmalı
        test("should validate all required fields", () => {
            const result = validateUserInput(validUser);
            expect(result).toHaveProperty("isValid"); // true false bir değer içermeli
            expect(result).toHaveProperty("errors"); // varsa hataları içeren bir dizi olmalı 
        });

        // eksik fieldların tespiti / hata mesajlarının hepsi döndürüldü mü
        test("should detect missing required fields", () => {
            const result = validateUserInput(invalidUser);
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "name",
                message : "İsim alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "surname",
                message : "Soyisim alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "username",
                message : "Kullanıcı adı alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "password",
                message : "Şifre alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "email",
                message : "E-posta alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "phone",
                message : "Telefon numarası alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "user_type",
                message : "Kullanıcı tipi alanı boş bırakılamaz"
            }));
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "customer_of",
                message : "Müşteri bilgisi alanı boş bırakılamaz"
            }));
        });
    });

    // individual fieldlar için testler
    describe("Field-specific validations", () => {
        // email format testi
        test("should validate email format", () => {
            const invalidEmailUser = {...validUser, email: "invalid-email"};
            const result = validateUserInput(invalidEmailUser);
            expect(result.isValid).toBe(false); // girilen email invalid olmalı
            expect(result.errors).toContainEqual(expect.objectContaining({
                field: "email",
                message: "Geçerli bir e-posta adresi giriniz (örn: kullanici@domain.com)"
            }));
        });

        // telefon numarası format testi
        test("should validate phone number format", () => {
            const invalidPhoneUser = {...validUser, phone : "invalid-phone"};
            const result = validateUserInput(invalidPhoneUser);
            expect(result.isValid).toBe(false); // girilen telefon numarası invalid olmalı
            expect(result.errors).toContainEqual(expect.objectContaining({
                field: "phone",
                message: "Telefon numarası 10 haneli olmalıdır (örn: 5551234567)"
            }));
        });

        // password format testi
        test("should validate correct password format", () => {
            const validPasswordUser = {...validUser, password : "Password123!"};
            const result = validateUserInput(validPasswordUser);
            expect(result.isValid).toBe(true); // parola geçerli ise true dönmeli
            expect(result.errors).toHaveLength(0); // paralo doğru hata yok
        });

        // özel karakter yoksa hata vermesi gerekiyor
        test("should invalidate password without a special character", () => {
            const invalidPasswordUser = {...validUser, password : "Password123"};
            const result = validateUserInput(invalidPasswordUser);
            expect(result.isValid).toBe(false); // özel karakter yoksa false dönmeli
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "password", // hata password fieldında olmalı
                message : "Şifre özel karakter içermeli"// özel karakter hatası dönmeli
            }));
        });

        // 8 karakterdn kısa ise hata dönmeli
        test("should invalidate password shorter than 8 characters", () => {
            const invalidPasswordUser = {...validUser, password : "Pass1!"};
            const result = validateUserInput(invalidPasswordUser);
            expect(result.isValid).toBe(false); // 8 karakterden kısa ise false dönmeli
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "password", 
                message : "Şifre en az 8 karakter uzunluğunda olmalıdır"
            }));
        });

        // en az bir büyük harf içermiyorsa error dönmeli
        test("should invalidate password without at least one uppercase letter", () => {
            const invalidPasswordUser = {...validUser, password: "password123!"};
            const result = validateUserInput(invalidPasswordUser);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "password",
                message : "En az bir büyük harf içermeli"
            }));
        });

        // en az bir küçük harf içermiyorsa error dönmeli
        test("should invalidate password without at least one lowercase letter", () => {
            const invalidPasswordUser = {...validUser, password: "PASSWORD123!"};
            const result = validateUserInput(invalidPasswordUser);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "password",
                message : "En az bir küçük harf içermeli"
            }));
        });

        // en az bir sayı içermiyorsa error dönmeli
        test("should invalidate password without at least one number", () => {
            const invalidPasswordUser = {...validUser, password: "Password!!"};
            const result = validateUserInput(invalidPasswordUser);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(expect.objectContaining({
                field : "password",
                message : "En az bir sayı içermeli"
            }));
        });


    });
});