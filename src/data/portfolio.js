export const profile = {
  name: "Tharindu Dhanushka",
  firstName: "Tharindu",
  lastName: "Dhanushka",
  role: "IT undergraduate · Aspiring software developer · Digital creator",
  location: "University of Vavuniya, Sri Lanka",
  image: `${import.meta.env.BASE_URL}images/profile.jpeg`,
  email: "",
  github: "https://github.com/tharindu-dhanushka",
  linkedin: "",
  instagram: "",
  about:
    "I’m an Information Technology undergraduate interested in building practical software and thoughtful digital experiences. I enjoy solving problems through code, and bringing a visual perspective to the interfaces and creative work I make.",
  learning:
    "I’m currently exploring frontend development with JavaScript and React, backend development with Node.js and MongoDB, and Python desktop applications. Alongside software, I’m developing my skills in UI design, graphic design, and video editing.",
};

export const skills = [
  {
    title: "Frontend Development",
    items: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Backend Development",
    items: ["Node.js", "Express.js", "MongoDB"],
  },
  {
    title: "Programming & Desktop Development",
    items: ["Python"],
  },
  {
    title: "Databases & Tools",
    items: ["MongoDB"],
  },
  {
    title: "Graphic Design & Video Editing",
    items: ["UI design", "Graphic design", "Video editing", "Digital content creation"],
  },
];

export const projects = [
  {
    name: "University Marks and Results Management System",
    description:
      "An academic project intended to improve the management, review, correction, and release of university marks and results.",
    technologies: ["Academic project"],
    status: "Academic project · details to confirm",
    image: null,
    imageAlt: "University marks and results management system interface screenshot",
    repository: "",
    demo: "",
  },
  {
    name: "Habit Forge",
    description:
      "A habit-tracking application with a backend built using Node.js, Express.js, and MongoDB.",
    technologies: ["Node.js", "Express.js", "MongoDB"],
    status: "Project · details to confirm",
    image: null,
    imageAlt: "Habit Forge habit-tracking application screenshot",
    repository: "",
    demo: "",
  },
  {
    name: "Travel Explorer",
    description:
      "A React application for exploring holiday destinations and saving favorites to a wishlist.",
    technologies: ["React"],
    status: "Project · details to confirm",
    image: null,
    imageAlt: "Travel Explorer destination discovery application screenshot",
    repository: "",
    demo: "",
  },
];

export const creativeCategories = [
  "All",
  "Graphic design",
  "Social media",
  "Posters",
  "Video editing",
  "Digital content",
];

export const creativeWork = [
  {
    title: "Graphic design",
    category: "Graphic design",
    type: "image",
    asset: "",
    placeholder: "Add a design project",
  },
  {
    title: "Social media posts & flyers",
    category: "Social media",
    type: "image",
    asset: "",
    placeholder: "Add a social media design",
  },
  {
    title: "Posters & event countdowns",
    category: "Posters",
    type: "image",
    asset: "",
    placeholder: "Add a poster or event design",
  },
  {
    title: "Video editing",
    category: "Video editing",
    type: "video",
    asset: "",
    placeholder: "Add a video thumbnail",
  },
  {
    title: "Digital content creation",
    category: "Digital content",
    type: "image",
    asset: "",
    placeholder: "Add a digital content project",
  },
];
