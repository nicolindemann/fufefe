import bent from "bent";
import { compressToUTF16 } from "lz-string";

export default async (req, res) => {
  const body = await bent("string")(req.query.url);
  res.send(compressToUTF16(body));
};
