export default async function handler(req, res) {
  try {
    const backendBase = "http://182.48.194.218:9191/api/v1";
    const url = backendBase + req.url; // includes path + query

    // Build fetch options
    const fetchOptions = {
      method: req.method,
      headers: { ...req.headers },
      // remove host to avoid issues
    };
    delete fetchOptions.headers.host;

    if (req.method !== "GET" && req.method !== "HEAD") {
      // body might be a stream; read it
      fetchOptions.body = JSON.stringify(req.body ?? {});
      fetchOptions.headers["content-type"] = fetchOptions.headers["content-type"] || "application/json";
    }

    const backendRes = await fetch(url, fetchOptions);

    // forward status and headers (some headers removed for safety)
    res.status(backendRes.status);
    backendRes.headers.forEach((value, name) => {
      // don't forward hop-by-hop headers
      if (!["transfer-encoding", "connection", "keep-alive", "content-encoding"].includes(name.toLowerCase())) {
        res.setHeader(name, value);
      }
    });

    const buffer = await backendRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}