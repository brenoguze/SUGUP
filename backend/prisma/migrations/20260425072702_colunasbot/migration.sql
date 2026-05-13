-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coluna" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "Coluna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "cliente" TEXT,
    "dataEntrega" TIMESTAMP(3),
    "lembreteEm" TIMESTAMP(3),
    "lembreteEnviado" BOOLEAN NOT NULL DEFAULT false,
    "colunasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coluna" ADD CONSTRAINT "Coluna_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_colunasId_fkey" FOREIGN KEY ("colunasId") REFERENCES "Coluna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
