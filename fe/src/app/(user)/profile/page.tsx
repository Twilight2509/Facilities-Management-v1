import NavbarComponent from "../../../../components/NavbarComponent";
import ProfileUserComponent from "../../../../components/ProfileUserComponent";

export const metadata = {
  title: "Profile",
};
export default function Profile({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorNavbarOne: string = "bg-transparent";
  const colorNavbarTwo: string = "bg-gray-300";
  return (
    <div className="overflow-x-hidden mt-8">
      <NavbarComponent
        colorNavbarOne={colorNavbarOne}
        colorNavbarTwo={colorNavbarTwo}
      />
      <div className="h-screen">
     <ProfileUserComponent/>
      </div>
</div>
  );
}
