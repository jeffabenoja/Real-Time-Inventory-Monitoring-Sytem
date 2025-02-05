import Container from "./navigation/Container";

interface Props {
    close?: () => void
}

export default function Sidebar({close} : Props) {
  return (
    <>
      <div onClick={close} className="h-screen w-screen fixed inset-0 bg-gray-200 opacity-50 lg:hidden z-20"></div>
      <div className="bg-sidebar fixed left-0 top-0 h-screen w-60 lg:w-64 z-30">
        <Container />
      </div>
    </>
  );
}
