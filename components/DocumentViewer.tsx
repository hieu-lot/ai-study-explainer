"use client";

type Props = {
  url?: string;
  content?: string;
};

export default function DocumentViewer({ url }: Props) {
  console.log("DocumentViewer src:", url);
  return <iframe src={url ?? ""} className="w-full h-full" title={url ?? "document-preview"} />;
}