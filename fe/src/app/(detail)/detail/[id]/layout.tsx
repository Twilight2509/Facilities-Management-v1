import type { Metadata } from "next";
import NavbarComponent from "../../../../../components/NavbarComponent";
import FooterComponent from "../../../../../components/FooterComponent";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const title = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Detail ${params.id}`);
    }, 100);
  });

  return {
    title: `${title}`,
  };
};

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorNavbarOne: string = "bg-gray-300";
  const colorNavbarTwo: string = "bg-gray-300";
  return (
    <div>
      <NavbarComponent
        colorNavbarOne={colorNavbarOne}
        colorNavbarTwo={colorNavbarTwo}
      />
      <div>{children}</div>
    </div>
  );
}
