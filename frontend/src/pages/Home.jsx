import { useState } from "react";
import React from "react";
import TemplateForm from "../components/TemplateForm";
import TemplatesContainer from "../components/TemplatesContainer";
import { useTemplateStore } from "../stores/useTemplateStore";
import { Search } from "lucide-react";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { categories, setSelectedCategory,setSearchTerm } = useTemplateStore();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex bg-base-100 h-[calc(100vh-64px)] relative">
      <aside className=" w-96 bg-base-200 flex flex-col items-center h-full">
        <div className="btn btn-secondary w-full">Show All Templates</div>
        <div className="mt-5">Categories</div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 p-2  text-center w-full">
          {categories.map((category) => (
            <div
              key={category}
              className="btn w-full border-2 border-accent hover:bg-accent hover:text-base-100"
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category}</span>
            </div>
          ))}
        </div>
      </aside>
      <main className="w-full max-w-8/12 ml-5 ">
        <div className="flex items-center  relative mt-3">
          <div>
            <Search className="absolute z-5 left-2 inset-y-0 my-auto" />
          </div>
          <div className="w-full">
            <input
              type="text"
              name="searchTerm"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates"
              className="input input-bordered w-full max-w-1/3 pl-10"
            ></input>
          </div>
        </div>
        <TemplatesContainer onClose={toggleOpen} />
      </main>
      <div
        className=" btn absolute right-5 top-0 mt-2 hover:scale-110 hover:text-white transition-transform duration-500"
        onClick={toggleOpen}
      >
        Create new template
      </div>

      {isOpen && <TemplateForm onClose={toggleOpen} />}
    </div>
  );
};

export default Home;
