# ใช้ Node.js 20 Alpine (น้ำหนักเบา)
FROM node:20-alpine

# สร้าง directory ของแอปใน container
WORKDIR /app

# Copy dependencies ก่อน (ช่วยให้ caching ทำงานได้ดี)
COPY package.json yarn.lock ./

# ติดตั้ง dependencies ด้วย yarn
RUN yarn install

# คัดลอก source code ทั้งหมดไปที่ container
COPY . .

# build typescript เป็น javascript (ถ้า backend คุณใช้ TS)
RUN yarn build

# เปิด port 4000
EXPOSE 4000

# สั่งรัน server
CMD ["yarn", "start"]
