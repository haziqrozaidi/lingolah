-- CreateTable
CREATE TABLE "Video" (
    "video_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subtitles" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "VideoPlaylist" (
    "playlist_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoPlaylist_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateTable
CREATE TABLE "VideoPlaylistItems" (
    "playlist_id" INTEGER NOT NULL,
    "video_id" INTEGER NOT NULL,
    "order" INTEGER,

    CONSTRAINT "VideoPlaylistItems_pkey" PRIMARY KEY ("playlist_id","video_id")
);

-- CreateTable
CREATE TABLE "VideoProgress" (
    "user_id" INTEGER NOT NULL,
    "video_id" INTEGER NOT NULL,
    "watch_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoProgress_pkey" PRIMARY KEY ("user_id","video_id")
);

-- AddForeignKey
ALTER TABLE "VideoPlaylistItems" ADD CONSTRAINT "VideoPlaylistItems_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "VideoPlaylist"("playlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoPlaylistItems" ADD CONSTRAINT "VideoPlaylistItems_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoProgress" ADD CONSTRAINT "VideoProgress_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;
