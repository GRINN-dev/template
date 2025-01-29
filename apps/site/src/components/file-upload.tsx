"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FileUpload({
  value,
  onChange,
  uploadProgress,
}: {
  value: any;
  onChange: (value: any) => void;
  uploadProgress: number | null;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "video/*": [".mp4"],
      "audio/*": [".mp3"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const removeFile = () => {
    onChange(null);
  };

  return (
    <Card className="mx-auto w-full p-6 shadow-none">
      {!uploadProgress ? (
        !value ? (
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Déposez le fichier ici...</p>
            ) : (
              <p>
                Glissez et déposez un fichier ici, ou cliquez pour sélectionner
                un fichier
              </p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">Aperçu du fichier</h3>
            <div className="relative mx-auto mt-2 h-32 w-32">
              <Image
                src={URL.createObjectURL(value)}
                alt="Aperçu du fichier"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="mt-2 text-center text-sm">{value.name}</p>
            <Button
              onClick={removeFile}
              variant="destructive"
              className="mt-2 w-full"
            >
              Supprimer le fichier
            </Button>
          </div>
        )
      ) : (
        <div className="mt-2 w-full">
          <div className="relative h-2 w-full rounded bg-gray-200">
            <div
              className="absolute left-0 top-0 h-2 rounded bg-primary"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-center text-sm">{uploadProgress}%</p>
        </div>
      )}
    </Card>
  );
}
