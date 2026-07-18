import { NextResponse } from "next/server";

// Ignore SSL/TLS validation errors on localhost in development to resolve local certificate intercept bugs
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: Request) {
  let file: any = null;
  
  try {
    const formData = await request.formData();
    file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Construct FormData for tmpfiles.org upload (server-to-server)
    const apiFormData = new FormData();
    apiFormData.append("file", file);

    const uploadRes = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: apiFormData,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload to tmpfiles.org");
    }

    const uploadData = await uploadRes.json();
    const rawUrl = uploadData.data.url;
    // Replace with direct download link
    const downloadUrl = rawUrl.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error("Backend Upload Error, attempting file.io fallback:", error);
    
    // Fallback to file.io if tmpfiles has an issue (utilizing already parsed file buffer)
    try {
      if (file) {
        const fileIoFormData = new FormData();
        fileIoFormData.append("file", file);

        const uploadRes = await fetch("https://file.io", {
          method: "POST",
          body: fileIoFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          return NextResponse.json({ url: uploadData.link || "N/A" });
        } else {
          throw new Error("file.io fallback failed");
        }
      }
    } catch (fallbackErr) {
      console.error("Fallback Upload Error:", fallbackErr);
    }

    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
