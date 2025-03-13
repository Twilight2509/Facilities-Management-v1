import type { Metadata } from "next";
import NavbarComponent from "../../../../components/NavbarComponent";
import NewFooter from "../../../../components/FooterComponent";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const title = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Lịch sử đặt trước`);
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
    <div className="flex flex-col min-h-screen">
      <NavbarComponent
        colorNavbarOne={colorNavbarOne}
        colorNavbarTwo={colorNavbarTwo}
      />
      <div className="mt-28 flex-grow">{children}</div>
      <div className="mt-auto">
        <NewFooter />
      </div>
    </div>
  );
}
