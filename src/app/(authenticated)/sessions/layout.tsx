import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const metadata = {
  title: "Sessions | Team Flux",
};

const SessionLayout = ({ children }: Props) => {
  return <>{children}</>
};

export default SessionLayout;
