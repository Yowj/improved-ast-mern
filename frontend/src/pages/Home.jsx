import { useState } from "react";
import React from "react";
import TemplateForm from "../components/TemplateForm";
import TemplatesContainer from "../components/TemplatesContainer";
import { useTemplateStore } from "../stores/useTemplateStore";
import { Plus, Search } from "lucide-react";
import OnlineUsers from "../components/OnlineUsers";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);


  const { categories, selectedCategory, setSelectedCategory, setSearchTerm, searchTerm } =
    useTemplateStore();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const clearAll = () => {
    setSelectedCategory("");
    setSearchTerm("");
  };

  return (
    <div className=" flex bg-base-100 mb-10 min-h-screen">
      <aside className="sticky top-1 flex flex-col h-[calc(100vh-4rem)] justify-between w-96">
        <div className="flex flex-col items-center p-5  ">
          <div className="btn btn-primary w-full m-3" onClick={clearAll}>
            Show All Templates
          </div>
          <div className="mt-2">Categories</div>
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-4 p-2  w-full pb-8 border-b-1">
            {categories.map((category) => (
              <div
                key={category}
                id={category}
                className={`btn w-full border-2 border-secondary hover:bg-accent hover:text-base-100 ${
                  selectedCategory === category ? "bg-accent text-base-100" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm(""); // clear search bar
                }}
              >
                <span className="truncate block w-full">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <main className="w-full max-w-11/16 ml-5 min-w-6/12">
        <div className="flex items-center  relative mt-3">
          <div>
            <Search className="absolute z-5 left-2 inset-y-0 my-auto" />
          </div>
          <div className="w-full">
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates"
              className="input input-bordered w-full sm:max-w-2/3 pl-10"
            ></input>
          </div>
        </div>
        <TemplatesContainer onClose={toggleOpen} />
      </main>
      <div className="space-y-3 flex flex-col w-full max-w-60 p-2 ">
        <div
          className="btn mt-2 hover:scale-110 hover:text-white transition-transform duration-500 hidden xl:flex "
          onClick={toggleOpen}
        >
          Create new template
        </div>

        {/* Icon button: only visible on md and larger */}
        <div
          className="btn mt-2 hover:scale-110 hover:text-white transition-transform duration-500  flex xl:hidden items-center justify-center w-full "
          onClick={toggleOpen}
        >
          <Plus className="w-5 h-5" />
        </div>
      </div>

      {isOpen && <TemplateForm onClose={toggleOpen} />}

      <OnlineUsers />
    </div>
  );
};

export default Home;
