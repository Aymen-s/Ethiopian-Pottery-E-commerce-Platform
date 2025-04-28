export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter pottery title (e.g., Jebena)",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder:
      "Enter pottery description (e.g., Handcrafted for coffee ceremonies)",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "jebenas", value: "jebenas", label: "Jebenas" },
      { id: "dists", value: "dists", label: "Dists" },
      { id: "bowls", value: "bowls", label: "Bowls" },
      { id: "vases", value: "vases", label: "Vases" },
      { id: "other", value: "other", label: "Other" }, // Add here
    ],
  },
  {
    label: "Cooperative",
    name: "cooperative",
    componentType: "select",
    options: [
      { id: "kechene", value: "kechene", label: "Kechene" },
      { id: "other", value: "other", label: "Other Artisans" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter pottery price (ETB)",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional, ETB)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "products", label: "products", path: "/shop/listing" },
  { id: "jebenas", label: "Jebenas", path: "/shop/listing" },
  { id: "dists", label: "Dists", path: "/shop/listing" },
  { id: "bowls", label: "Bowls", path: "/shop/listing" },
  { id: "vases", label: "Vases", path: "/shop/listing" },
  { id: "other", label: "Other", path: "/shop/listing" },
  { id: "search", label: "Search", path: "/shop/search" },
];

export const filterOptions = {
  category: [
    { id: "jebenas", label: "Jebenas" },
    { id: "dists", label: "Dists" },
    { id: "bowls", label: "Bowls" },
    { id: "vases", label: "Vases" },
    { id: "other", label: "Other" },
  ],
  cooperative: [
    { id: "kechene", label: "Kechene" },
    { id: "other", label: "Other Artisans" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const categoryOptionsMap = {
  jebenas: "Jebenas",
  dists: "Dists",
  bowls: "Bowls",
  vases: "Vases",
  other: "Other",
};

export const cooperativeOptionsMap = {
  kechene: "Kechene",
  other: "Other Artisans",
};

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address (e.g., Bole, Addis Ababa)",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city (e.g., Addis Ababa)",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode (if applicable)",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Delivery Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter delivery notes (e.g., Motorbike or EMS preferred)",
  },
];
