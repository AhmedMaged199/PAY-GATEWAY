require('dotenv').config(); // السطر ده لازم يكون أول سطر
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

// السيرفر هيسحب البيانات دلوقتي من ملف .env أوتوماتيك
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY
);

app.use(express.json());
app.use(express.static('public')); 

app.post('/api/create-order', async (req, res) => {
    const { clientPhone, amount, merchantId } = req.body;
    
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ 
            wallet_number: clientPhone, 
            amount: amount, 
            merchant_id: merchantId,
            status: 'pending' 
        }]);

    if (error) {
        console.error("خطأ:", error);
        return res.status(500).json({ error: error.message });
    }
    
    console.log("تم إضافة طلب جديد بنجاح للعميل:", clientPhone);
    res.json({ success: true });
});

app.listen(port, () => console.log(`🚀 السيرفر شغال وزي الفل على بورت ${port}`));