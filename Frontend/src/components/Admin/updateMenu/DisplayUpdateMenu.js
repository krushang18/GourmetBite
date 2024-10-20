import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../../shared/SharedMenu/searchBar";
import MenuItemList from "../../shared/SharedMenu/MenuItemList";
import CategoriesSidebar from "../../shared/SharedMenu/categoriesSideBar";

function DisplayUpdateMenu() {
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const categoryRefs = useRef({});
  const navigate = useNavigate();

  const handleScroll = () => {
    let closestCategory = null;
    let minDistance = Infinity;

    categories.forEach((category) => {
      const categoryRef = categoryRefs.current[category];
      if (categoryRef) {
        const distance = Math.abs(categoryRef.getBoundingClientRect().top);
        if (distance < minDistance) {
          closestCategory = category;
          minDistance = distance;
        }
      }
    });

    if (closestCategory) {
      setActiveCategory(closestCategory);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseCategory = await fetch(
          "http://localhost:5000/menu/categories/list"
        );
        const responseMenu = await fetch("http://localhost:5000/menu/");
        if (!responseCategory.ok || !responseMenu.ok) {
          throw new Error("Failed to fetch categories");
        }
        const dataCategory = await responseCategory.json();
        const dataMenu = await responseMenu.json();
        setCategories(dataCategory);
        setFoodItems(dataMenu);
        setFilteredFoodItems(dataMenu);
        setActiveCategory(dataCategory[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    const categoryRef = categoryRefs.current[category];
    if (categoryRef) {
      categoryRef.scrollIntoView({ behavior: "smooth" });
      setActiveCategory(category);
    }
  };

  const handleEditClick = (item) => {
    navigate(`/admin/updateItemForm`, { state: { item } });
  };

  const handleAddItemClick = () => {}
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const filteredItems = foodItems.filter(
        (item) =>
          item.foodName.toLowerCase().includes(term.toLowerCase()) ||
          item.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFoodItems(filteredItems);
    } else {
      setFilteredFoodItems(foodItems);
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        {!searchTerm && (
          <CategoriesSidebar
            categories={categories}
            activeCategory={activeCategory}
            handleCategoryClick={handleCategoryClick}
          />
        )}

        <main
          className={`col-md-9 ms-sm-auto col-lg-10 px-md-4 ${
            searchTerm ? "w-100" : ""
          }`}
        >
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Order Online</h1>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="scrollable-container" onScroll={handleScroll}>
            <MenuItemList
              categories={categories}
              foodItems={filteredFoodItems}
              categoryRefs={categoryRefs}
              handleEditClick={handleEditClick}
              searchTerm={searchTerm}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DisplayUpdateMenu;
