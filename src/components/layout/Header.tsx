import { Leaf } from 'lucide-react';
import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center">
        <Leaf size={32} className="mr-3" />
        <h1 className="text-2xl md:text-3xl font-semibold">NutriSleuth</h1>
      </div>
    </header>
  );
};

export default Header;
