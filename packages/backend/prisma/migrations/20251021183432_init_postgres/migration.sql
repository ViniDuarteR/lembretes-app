-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "paciente" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "medico" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "endereco" TEXT NOT NULL,
    "compareceu" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dosagem" TEXT NOT NULL,
    "frequencia" TEXT NOT NULL,
    "horarioInicio" TIMESTAMP(3) NOT NULL,
    "dataFinal" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);
