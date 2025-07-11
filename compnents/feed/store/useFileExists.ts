import { useEffect, useState } from "react";

import { checkFileExists } from "./utils";

/**
 * React hook to check if a local file exists.
 * @param uri - File URI (string or { uri: string })
 */
export function useFileExists(uri?: string | { uri: string } | null) {
  const [isExist, setIsExist] = useState(false);
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);

  useEffect(() => {
    const check = async() => {
      const result = await checkFileExists(uri);
      setIsExist(result.isExist);
      setResolvedUri(result.resolvedUri);
    };

    check();
  }, [uri]);

  return { isExist, resolvedUri };
}
