-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "whatsappId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cropType" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "areaHectares" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NdviReading" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "readingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ndviMean" DOUBLE PRECISION NOT NULL,
    "ndwiMean" DOUBLE PRECISION NOT NULL,
    "seasonalAverage" DOUBLE PRECISION NOT NULL,
    "anomalyPct" DOUBLE PRECISION NOT NULL,
    "cloudCoverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'Sentinel-2',

    CONSTRAINT "NdviReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherReading" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "readingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rainfallMm" DOUBLE PRECISION NOT NULL,
    "tempMax" DOUBLE PRECISION NOT NULL,
    "tempMin" DOUBLE PRECISION NOT NULL,
    "soilMoisture" DOUBLE PRECISION,
    "forecast14dayMm" DOUBLE PRECISION NOT NULL,
    "droughtIndex" DOUBLE PRECISION,

    CONSTRAINT "WeatherReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'drought',
    "severity" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageSent" BOOLEAN NOT NULL DEFAULT false,
    "messageText" TEXT,
    "whatsappStatus" TEXT,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "alertId" TEXT,
    "amountUsd" DOUBLE PRECISION NOT NULL,
    "triggerReason" TEXT NOT NULL,
    "ndviAtTrigger" DOUBLE PRECISION,
    "rainfallAtTrigger" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "mobileMoneyRef" TEXT,
    "method" TEXT NOT NULL DEFAULT 'M-Pesa (simulated)',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_phoneNumber_key" ON "Farmer"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NdviReading" ADD CONSTRAINT "NdviReading_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherReading" ADD CONSTRAINT "WeatherReading_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

┌─────────────────────────────────────────────────────────┐
│  Update available 5.22.0 -> 7.8.0                       │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘

-- ============================================================
-- AgriWatch demo seed — 8 farmers / 6 countries (idempotent)
-- Mirrors prisma/seed.ts. Safe to re-run.
-- ============================================================
TRUNCATE "Payout","Alert","WeatherReading","NdviReading","Farm","Farmer" RESTART IDENTITY CASCADE;

INSERT INTO "Farmer" (id,"phoneNumber",name,language) VALUES
('11111111-0000-0000-0000-000000000001','+221701234567','Amara Diallo','fr'),
('11111111-0000-0000-0000-000000000002','+212601234567','Fatima Al-Rashid','ar'),
('11111111-0000-0000-0000-000000000003','+254701234567','James Ochieng','sw'),
('11111111-0000-0000-0000-000000000004','+22370123456','Moussa Coulibaly','fr'),
('11111111-0000-0000-0000-000000000005','+251911234567','Aisha Mohammed','en'),
('11111111-0000-0000-0000-000000000006','+233501234567','Kwame Asante','en'),
('11111111-0000-0000-0000-000000000007','+255712345678','Halima Mwangi','sw'),
('11111111-0000-0000-0000-000000000008','+201001234567','Ibrahim Al-Sayed','ar');

INSERT INTO "Farm" (id,"farmerId",name,"cropType",latitude,longitude,"areaHectares",country) VALUES
('22222222-0000-0000-0000-000000000001','11111111-0000-0000-0000-000000000001','Amara''s farm','millet',14.4974,-14.4524,1.5,'Senegal'),
('22222222-0000-0000-0000-000000000002','11111111-0000-0000-0000-000000000002','Fatima''s farm','wheat',31.7917,-7.0926,1.5,'Morocco'),
('22222222-0000-0000-0000-000000000003','11111111-0000-0000-0000-000000000003','James''s farm','maize',-0.0236,37.9062,1.5,'Kenya'),
('22222222-0000-0000-0000-000000000004','11111111-0000-0000-0000-000000000004','Moussa''s farm','sorghum',12.6392,-8.0029,1.5,'Mali'),
('22222222-0000-0000-0000-000000000005','11111111-0000-0000-0000-000000000005','Aisha''s farm','maize',9.1450,40.4897,1.5,'Ethiopia'),
('22222222-0000-0000-0000-000000000006','11111111-0000-0000-0000-000000000006','Kwame''s farm','cassava',7.9465,-1.0232,1.5,'Ghana'),
('22222222-0000-0000-0000-000000000007','11111111-0000-0000-0000-000000000007','Halima''s farm','maize',-6.3690,34.8888,1.5,'Tanzania'),
('22222222-0000-0000-0000-000000000008','11111111-0000-0000-0000-000000000008','Ibrahim''s farm','wheat',28.2,30.8,1.5,'Egypt');

INSERT INTO "NdviReading" (id,"farmId","ndviMean","ndwiMean","seasonalAverage","anomalyPct") VALUES
('55555555-0000-0000-0000-000000000001','22222222-0000-0000-0000-000000000001',0.28,-0.18,0.51,-45.1),
('55555555-0000-0000-0000-000000000002','22222222-0000-0000-0000-000000000002',0.42,-0.18,0.55,-23.6),
('55555555-0000-0000-0000-000000000003','22222222-0000-0000-0000-000000000003',0.61,0.10,0.58,5.2),
('55555555-0000-0000-0000-000000000004','22222222-0000-0000-0000-000000000004',0.31,-0.18,0.49,-36.7),
('55555555-0000-0000-0000-000000000005','22222222-0000-0000-0000-000000000005',0.55,0.10,0.52,5.8),
('55555555-0000-0000-0000-000000000006','22222222-0000-0000-0000-000000000006',0.48,0.10,0.60,-20.0),
('55555555-0000-0000-0000-000000000007','22222222-0000-0000-0000-000000000007',0.38,-0.18,0.54,-29.6),
('55555555-0000-0000-0000-000000000008','22222222-0000-0000-0000-000000000008',0.44,-0.18,0.47,-6.4);

INSERT INTO "WeatherReading" (id,"farmId","rainfallMm","tempMax","tempMin","forecast14dayMm") VALUES
('66666666-0000-0000-0000-000000000001','22222222-0000-0000-0000-000000000001',4.2,38.5,18.0,8.1),
('66666666-0000-0000-0000-000000000002','22222222-0000-0000-0000-000000000002',22.4,29.2,18.0,32.0),
('66666666-0000-0000-0000-000000000003','22222222-0000-0000-0000-000000000003',22.4,29.2,18.0,32.0),
('66666666-0000-0000-0000-000000000004','22222222-0000-0000-0000-000000000004',9.1,29.2,18.0,32.0),
('66666666-0000-0000-0000-000000000005','22222222-0000-0000-0000-000000000005',22.4,29.2,18.0,32.0),
('66666666-0000-0000-0000-000000000006','22222222-0000-0000-0000-000000000006',22.4,29.2,18.0,32.0),
('66666666-0000-0000-0000-000000000007','22222222-0000-0000-0000-000000000007',9.1,29.2,18.0,32.0),
('66666666-0000-0000-0000-000000000008','22222222-0000-0000-0000-000000000008',22.4,29.2,18.0,32.0);

INSERT INTO "Alert" (id,"farmId","alertType",severity,"messageSent","messageText","whatsappStatus") VALUES
('33333333-0000-0000-0000-000000000001','22222222-0000-0000-0000-000000000001','drought','critical',true,'Demo alert for Amara Diallo.','delivered'),
('33333333-0000-0000-0000-000000000002','22222222-0000-0000-0000-000000000002','drought','medium',true,'Demo alert for Fatima Al-Rashid.','delivered'),
('33333333-0000-0000-0000-000000000004','22222222-0000-0000-0000-000000000004','drought','high',true,'Demo alert for Moussa Coulibaly.','delivered'),
('33333333-0000-0000-0000-000000000007','22222222-0000-0000-0000-000000000007','drought','high',true,'Demo alert for Halima Mwangi.','delivered');

INSERT INTO "Payout" (id,"farmId","alertId","amountUsd","triggerReason","ndviAtTrigger","rainfallAtTrigger",status,"mobileMoneyRef",method) VALUES
('44444444-0000-0000-0000-000000000001','22222222-0000-0000-0000-000000000001','33333333-0000-0000-0000-000000000001',15,'NDVI 45% below seasonal average, rainfall 4.2mm/week',0.28,4.2,'sent','AW-DEMO0001','M-Pesa (simulated)');
