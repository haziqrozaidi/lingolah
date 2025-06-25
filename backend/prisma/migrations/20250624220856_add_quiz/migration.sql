-- CreateTable
CREATE TABLE "Quiz" (
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "result" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "question_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAnswer" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "QuizChoice" (
    "choice_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "QuizChoice_pkey" PRIMARY KEY ("choice_id")
);

-- CreateTable
CREATE TABLE "QuizMatchPair" (
    "pair_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "leftItem" TEXT NOT NULL,
    "rightItem" TEXT NOT NULL,

    CONSTRAINT "QuizMatchPair_pkey" PRIMARY KEY ("pair_id")
);

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizChoice" ADD CONSTRAINT "QuizChoice_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuizQuestion"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizMatchPair" ADD CONSTRAINT "QuizMatchPair_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuizQuestion"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;
