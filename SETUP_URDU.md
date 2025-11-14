# Setup Guide (اردو/हिंदी)

## کیسے چلائیں (How to Run)

### مرحلہ 1: Dependencies Install کریں
Terminal یا Command Prompt کھولیں اور project folder میں جائیں، پھر چلائیں:
```
npm install
```

### مرحلہ 2: Server Start کریں
```
npm start
```

یا
```
node server.js
```

### مرحلہ 3: Browser میں کھولیں
```
http://localhost:3000
```

## اہم نکات (Important Points)

1. **Node.js ضروری ہے** - اگر نہیں ہے تو پہلے install کریں
2. **Database connection** - `.env` file میں پہلے سے database URL set ہے
3. **تمام fields ضروری ہیں** - Name, Email, Phone, Business Name
4. **Form submit** کرنے پر data database میں save ہو جائے گا

## اگر کوئی مسئلہ ہو (Troubleshooting)

- Server start نہیں ہو رہا؟ → Check کریں کہ port 3000 free ہے
- Database error؟ → `.env` file میں connection string check کریں
- Form submit نہیں ہو رہا؟ → Browser console میں errors check کریں

