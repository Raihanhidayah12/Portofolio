import React, { useEffect, useState, useCallback, useMemo } from "react";



import { supabase } from "../supabase";

import { mapProjects, mapCertificates, mapTechStack } from "../utils/supabase/mappers";
import { TECH_STACK_PUBLIC_COLUMNS } from "../utils/techStackQuery";



import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";

import Tabs from "@mui/material/Tabs";

import Tab from "@mui/material/Tab";

import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";

import CardProject from "../components/CardProject";

import TechStackCategories from "../components/TechStackCategories";

import AOS from "aos";
import { aosStaggerDelay } from "../lib/aos";

import Certificate from "../components/Certificate";

import { Code, Award } from "lucide-react";

import {

  SectionShell,

  SectionHeader,

  portfolioTabsSx,

  portfolioAppBarSx,
  GlowButton,
} from "../components/ui/layout";





const ToggleButton = ({ onClick, isShowingMore }) => (

  <GlowButton variant="ghost" onClick={onClick} className="!px-3 !py-1.5">

    <span className="relative z-10 flex items-center gap-2">

      {isShowingMore ? "See Less" : "See More"}

      <svg

        xmlns="http://www.w3.org/2000/svg"

        width="16"

        height="16"

        viewBox="0 0 24 24"

        fill="none"

        stroke="currentColor"

        strokeWidth="2"

        strokeLinecap="round"

        strokeLinejoin="round"

        className={`

          transition-transform 

          duration-300 

          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}

        `}

      >

        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>

      </svg>

    </span>

  </GlowButton>

);





function TabPanel({ children, value, index, ...other }) {

  return (

    <div

      role="tabpanel"

      hidden={value !== index}

      id={`full-width-tabpanel-${index}`}

      aria-labelledby={`full-width-tab-${index}`}

      {...other}

    >

      {value === index && (

        <Box sx={{ p: { xs: 1, sm: 3 } }}>

          <Typography component="div">{children}</Typography>

        </Box>

      )}

    </div>

  );

}



TabPanel.propTypes = {

  children: PropTypes.node,

  index: PropTypes.number.isRequired,

  value: PropTypes.number.isRequired,

};



function a11yProps(index) {

  return {

    id: `full-width-tab-${index}`,

    "aria-controls": `full-width-tabpanel-${index}`,

  };

}



const PROJECT_CATEGORIES = [
  { id: "web", label: "Web" },
  { id: "app", label: "App" },
  { id: "uiux", label: "UI/UX" },
];

const APP_KEYWORDS = ["flutter", "react native", "dart", "kotlin", "swift", "android", "ios", "mobile", "expo"];
const UIUX_KEYWORDS = ["figma", "adobe xd", "sketch", "prototype", "wireframe", "ui/ux", "ui", "ux", "design"];

function getProjectCategory(project) {
  if (project.category || project.Category) return project.category || project.Category;
  const stack = (project.TechStack || []).map((t) => t.toLowerCase());
  const title = (project.Title || "").toLowerCase();
  const desc = (project.Description || "").toLowerCase();
  const allText = [...stack, title, desc].join(" ");

  if (APP_KEYWORDS.some((k) => allText.includes(k))) return "app";
  if (UIUX_KEYWORDS.some((k) => allText.includes(k))) return "uiux";
  return "web";
}

export default function FullWidthTabs() {

  const [value, setValue] = useState(0);

  const [projects, setProjects] = useState([]);

  const [certificates, setCertificates] = useState([]);

  const [techStacks, setTechStacks] = useState([]);

  const [showAllProjects, setShowAllProjects] = useState(false);

  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null);

  const isMobile = window.innerWidth < 768;

  const initialItems = isMobile ? 4 : 6;

  const filteredProjects = useMemo(() => {
    if (!activeCategory) return projects;
    return projects.filter((p) => getProjectCategory(p) === activeCategory);
  }, [projects, activeCategory]);



  const fetchData = useCallback(async () => {

    try {

      const [projectsResponse, certificatesResponse, techStackResponse] = await Promise.all([

        supabase.from("projects").select("*").order("id", { ascending: false }),

        supabase.from("certificates").select("*").order("id", { ascending: false }),

        supabase

          .from("tech_stack")

          .select(TECH_STACK_PUBLIC_COLUMNS)

          .eq("is_published", true)

          .order("order_index", { ascending: true }),

      ]);



      if (projectsResponse.error) throw projectsResponse.error;

      if (certificatesResponse.error) throw certificatesResponse.error;

      if (techStackResponse.error) throw techStackResponse.error;



      const projectData = mapProjects(projectsResponse.data);

      const certificateData = mapCertificates(certificatesResponse.data);

      const techStackData = mapTechStack(techStackResponse.data);



      setProjects(projectData);

      setCertificates(certificateData);

      setTechStacks(techStackData);



      localStorage.setItem("projects", JSON.stringify(projectData));

      localStorage.setItem("certificates", JSON.stringify(certificateData));

      localStorage.setItem("techStacks", JSON.stringify(techStackData));

    } catch (error) {

      console.error("Error fetching data from Supabase:", error.message);

    }

  }, []);







  useEffect(() => {

    const cachedProjects = localStorage.getItem("projects");

    const cachedCertificates = localStorage.getItem("certificates");

    const cachedTechStacks = localStorage.getItem("techStacks");



    if (cachedProjects) setProjects(JSON.parse(cachedProjects));

    if (cachedCertificates) setCertificates(JSON.parse(cachedCertificates));

    if (cachedTechStacks) setTechStacks(JSON.parse(cachedTechStacks));



    fetchData();

  }, [fetchData]);

  useEffect(() => {
    AOS.refresh();
  }, [projects, certificates, value]);

  const handleChange = (event, newValue) => {

    setValue(newValue);

  };



  const toggleShowMore = useCallback((type) => {

    if (type === 'projects') {

      setShowAllProjects(prev => !prev);

    } else {

      setShowAllCertificates(prev => !prev);

    }

  }, []);



  const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, initialItems);

  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);



  return (

    <SectionShell id="Portofolio" className="pb-16 pt-24 sm:pt-28">

      <SectionHeader

        label="03 — Portfolio"

        title="Portfolio Showcase"

        subtitle="Proyek, sertifikat, dan teknologi yang saya gunakan."

      />



      <div

        id="TechStack"

        className="mb-10 sm:mb-12 border border-zinc-800/80 bg-zinc-950/50 py-6 sm:py-8"

        data-aos="fade-up"
      >

        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-500/90 text-center mb-2">

          Tech Stack

        </p>

        <p className="text-center text-zinc-600 text-xs mb-5 max-w-md mx-auto">

          Filter menurut kategori: Frontend, Backend, Database, Mobile, Design, Cloud, DevOps

        </p>

        <TechStackCategories techStacks={techStacks} />

      </div>



      <Box sx={{ width: "100%" }}>

        <AppBar position="static" elevation={0} sx={portfolioAppBarSx} className="mb-6">

          <Tabs

            value={value}

            onChange={handleChange}

            variant="fullWidth"

            sx={portfolioTabsSx}

          >

            <Tab

              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}

              label="Projects"

              {...a11yProps(0)}

            />

            <Tab

              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}

              label="Certificates"

              {...a11yProps(1)}

            />

          </Tabs>

        </AppBar>



        <div>

          <TabPanel value={value} index={0}>

            <div className="flex flex-wrap justify-center gap-2 mb-6 px-2" role="tablist" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border transition-colors ${
                  !activeCategory
                    ? "border-sky-500/50 bg-sky-500/10 text-sky-300"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                Semua
              </button>
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border transition-colors ${
                    activeCategory === cat.id
                      ? "border-sky-500/50 bg-sky-500/10 text-sky-300"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {activeCategory && (
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} — <span className="text-sky-400">{PROJECT_CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
              </p>
            )}

            <div className="container mx-auto flex justify-center items-center overflow-hidden">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">

                {displayedProjects.map((project, index) => (

                  <div

                    key={project.id || index}

                    data-aos="fade-up"
                    data-aos-delay={aosStaggerDelay(index)}

                  >

                    <CardProject

                      Img={project.Img}

                      Title={project.Title}

                      Description={project.Description}

                      Link={project.Link}
                      id={project.id}
                      Category={project.Category}
                    />

                  </div>

                ))}

              </div>

            </div>

            {filteredProjects.length > initialItems && (

              <div className="mt-6 w-full flex justify-start">

                <ToggleButton

                  onClick={() => toggleShowMore('projects')}

                  isShowingMore={showAllProjects}

                />

              </div>

            )}

          </TabPanel>



          <TabPanel value={value} index={1}>

            <div className="container mx-auto flex justify-center items-center overflow-hidden">

              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">

                {displayedCertificates.map((certificate, index) => (

                  <div

                    key={certificate.id || index}

                    data-aos="fade-up"
                    data-aos-delay={aosStaggerDelay(index)}

                  >

                    <Certificate ImgSertif={certificate.Img} />

                  </div>

                ))}

              </div>

            </div>

            {certificates.length > initialItems && (

              <div className="mt-6 w-full flex justify-start">

                <ToggleButton

                  onClick={() => toggleShowMore('certificates')}

                  isShowingMore={showAllCertificates}

                />

              </div>

            )}

          </TabPanel>

        </div>

      </Box>

    </SectionShell>

  );

}

