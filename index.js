require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');

// ===== ตั้งค่า =====
const AUTO_ROLE_ID = '1540633696560750632'; // 👈 เปลี่ยนเป็น ID ยศของคุณ

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.GuildMember]
});

client.once('ready', () => {
    console.log(`✅ บอทออนไลน์แล้ว: ${client.user.tag}`);
});

// 🎯 ให้ยศทันทีเมื่อมีคนเข้าเซิร์ฟเวอร์
client.on('guildMemberAdd', async (member) => {
    try {
        const role = member.guild.roles.cache.get(AUTO_ROLE_ID);

        if (!role) {
            console.error(`❌ ไม่พบยศ ID: ${AUTO_ROLE_ID}`);
            return;
        }

        await member.roles.add(role);
        console.log(`✅ ให้ยศ "role.name"แก่{role.name}" แก่role.name"แก่{member.user.tag} แล้ว`);

        // 💬 ส่งข้อความต้อนรับใน DM (ถ้าไม่อยากได้ ลบบรรทัดนี้ออก)
        await member.send(`ยินดีต้อนรับสู่ **{member.guild.name}**! คุณได้รับยศ \`{role.name}\` แล้ว 🎉`);
    } catch (error) {
        console.error(`❌ ให้ยศไม่สำเร็จ (${member.user.tag}):`, error.message);
    }
});

// 🔄 Web server กัน Render หลับ
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('🌐 Web server ทำงานที่ port 3000'));

client.login(process.env.BOT_TOKEN);
