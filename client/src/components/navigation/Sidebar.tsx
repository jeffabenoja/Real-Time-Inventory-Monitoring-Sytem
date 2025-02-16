import Container from "./Container";

interface Props {
  close?: () => void;
}

export default function Sidebar({ close }: Props) {
  return (
    <div>
      <div 
        onClick={close} 
        className="fixed inset-0 bg-gray-200 opacity-50 lg:hidden z-30" 
      ></div>

      <div 
        className="bg-background fixed left-0 top-0 h-screen w-60 lg:w-64 z-40"  
      >
        <Container closeSidebar={close!}/>
      </div>
    </div>
  );
}