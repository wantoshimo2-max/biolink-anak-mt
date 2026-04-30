import postgres from 'postgres';
import 'dotenv/config';

async function test() {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
        console.error("❌ ERROR: DATABASE_URL tidak ditemukan di environment variables!");
        process.exit(1);
    }

    console.log("-----------------------------------------");
    console.log("🔍 DEBUG DATABASE CONNECTION");
    console.log("-----------------------------------------");
    console.log("🌐 Database Host:", dbUrl.split('@')[1] || "Format URL salah");
    
    // Gunakan timeout agar tidak hang selamanya
    const sql = postgres(dbUrl, { 
        timeout: 10, // 10 detik timeout
        connect_timeout: 10
    });

    try {
        console.log("⏳ Sedang mencoba melakukan query 'SELECT 1'...");
        const result = await sql`SELECT 1 as connected`;
        console.log("✅ KONEKSI BERHASIL!");
        console.log("📊 Hasil Query:", result);
    } catch (err) {
        console.error("❌ KONEKSI GAGAL!");
        console.error("📝 Detail Error:", err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error("💡 Saran: Database tidak bisa dijangkau. Cek apakah IP server sudah di-whitelist atau port sudah benar.");
        } else if (err.message.includes('timeout')) {
            console.error("💡 Saran: Koneksi timeout. Ini biasanya terjadi jika menggunakan port pooler (6543) yang salah atau firewall memblokir koneksi.");
        }
    } finally {
        await sql.end();
        console.log("-----------------------------------------");
        process.exit();
    }
}

test();
