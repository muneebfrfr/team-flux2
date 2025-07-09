import Head from "next/head";
export const AppHead = ({ title }: { title?: string }) => {
  return (
    <Head>
      <title>{title || ""}</title>
    </Head>
  );
};