import React, { useEffect, useState, useCallback } from "react";



import { supabase } from "../supabase";

import { mapProjects, mapCertificates, mapTechStack } from "../utils/supabase/mappers";



import PropTypes from "prop-types";

import SwipeableViews from "react-swipeable-views";

import { useTheme } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";

import Tabs from "@mui/material/Tabs";

import Tab from "@mui/material/Tab";

import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";

import CardProject from "../components/CardProject";

import TechStackLoop from "../components/TechStackLoop";

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



export default function FullWidthTabs() {

  const theme = useTheme();

  const [value, setValue] = useState(0);

  const [projects, setProjects] = useState([]);

  const [certificates, setCertificates] = useState([]);

  const [techStacks, setTechStacks] = useState([]);

  const [showAllProjects, setShowAllProjects] = useState(false);

  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const isMobile = window.innerWidth < 768;

  const initialItems = isMobile ? 4 : 6;



  const fetchData = useCallback(async () => {

    try {

      const [projectsResponse, certificatesResponse, techStackResponse] = await Promise.all([

        supabase.from("projects").select("*").order("id", { ascending: false }),

        supabase.from("certificates").select("*").order("id", { ascending: false }),

        supabase

          .from("tech_stack")

          .select("*")

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



  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);

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

        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-500/90 text-center mb-5">

          Tech Stack

        </p>

        <TechStackLoop techStacks={techStacks} />

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



        <SwipeableViews

          axis={theme.direction === "rtl" ? "x-reverse" : "x"}

          index={value}

          onChangeIndex={setValue}

        >

          <TabPanel value={value} index={0} dir={theme.direction}>

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

                    />

                  </div>

                ))}

              </div>

            </div>

            {projects.length > initialItems && (

              <div className="mt-6 w-full flex justify-start">

                <ToggleButton

                  onClick={() => toggleShowMore('projects')}

                  isShowingMore={showAllProjects}

                />

              </div>

            )}

          </TabPanel>



          <TabPanel value={value} index={1} dir={theme.direction}>

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

        </SwipeableViews>

      </Box>

    </SectionShell>

  );

}

