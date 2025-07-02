// types/swagger.d.ts

declare module 'swagger-ui-react' {
  import * as React from 'react';

  const SwaggerUI: React.FC<{ spec: object }>;
  export default SwaggerUI;
}

declare module 'swagger-jsdoc';
