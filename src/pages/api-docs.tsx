import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState<object | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      const res = await fetch('/api/swagger');
      const data = await res.json();
      setSpec(data);
    };

    fetchSpec();
  }, []);

  if (!spec) return <div>Loading Swagger...</div>;

  return <SwaggerUI spec={spec} />;
}
