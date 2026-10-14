-- Seed 007: Official Trust Particulars, Coordinates, Mission Sustainable India & 4 Activity Pillars
-- Author: Suchitra (Backend & Database Developer)

DELETE FROM trust_profile;

INSERT INTO trust_profile (
    trust_name,
    short_name,
    pan,
    registration_no,
    exemption_80g_no,
    address,
    city,
    state,
    pincode,
    phone_landline,
    phone_mobiles,
    email,
    qr_code_url,
    facebook_url,
    twitter_handle,
    linkedin_url,
    whatsapp_numbers,
    introduction,
    vision,
    mission,
    mission_sustainable_india,
    activity_pillars,
    is_active
) VALUES (
    'Saraswati Educational & Charitable Trust',
    'SECT',
    'ABBTS7158P',
    'TRUST/OD/2018/0091',
    'AAETS9821BF20214',
    'K-8-82, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha-751029',
    'Bhubaneswar',
    'Odisha',
    '751029',
    '0674-2954256',
    ARRAY['9937159760', '9438747172'],
    'strust12@gmail.com',
    '/qr_code.png',
    'https://www.facebook.com/SaraswatiEducationalCharitableTrust',
    '@saraswati_trust',
    'https://www.linkedin.com/company/saraswati-educational-charitable-trust',
    ARRAY['9438747172', '9937159760'],
    'SARASWATI EDUCATIONAL & CHARITABLE TRUST, is a professionally managed committed NGO active in community capacity building and issue based networking. The primary focus of SECT involved in charity, social service, education and teaching, Promotion of environmental protection by means of implementation of renewable energy technologies (using wind, solar, biomass energy, etc.) and energy savings, Dissemination of knowledge to the public on energy resources conservation, Promotion of creation and implementation of ecologically clean and safe technologies for both renewable energy utilization and energy saving technologies, Conduction of renewable energy resources assessments, prefeasibility and feasibility studies to demonstrate economical, environmental, social benefits of RE utilization for public and commercial needs, protection of natural resources such as water, vegetation and soil as well as the promotion of dynamic education, Solid Waste Management, Biogas, MSW management, community building, reduce, recycle, reuse, e-vehicle.',
    'To explore, develop and sustain efforts for develop renewable energy sector and enhance its natural resources use.',
    'To provide energy and support to the weaker and backward tribal community to empower them so that they can become capable of make use of the resource and to create an environment where they can play the decision making role in the society and to manage the resources through the participatory value based process. We have been working on 5P principle i.e. Prosperity (Economic Sustainability), Planet (Environmental Sustainability), People (Social Sustainability), Peace and Partnership to have sustainable development. We believe that the above 5Ps can be achieved with the 6th P i.e., Political Sustainability which can come from Sustainable Governance.',
    '{
      "title": "Mission Sustainable India",
      "emblem_url": "/mission_sustainable_india.jpg",
      "start_date": "2022-08-15",
      "historical_context": "Coinciding 75 years of political Independence from British rule",
      "narrative": "We have launched a new mission for our mother earth which shall help India to achieve sustainability in a sustainable approach. Mission Sustainable India is an initiative by an enthusiastic group of volunteers, who have made an attempt to co-work, although located at various parts within the country. The members have collectively been working on different domains of sustainability such as Food, Water, Air, Energy, Waste Management, Habitat and Livelihood, Healthy and Natural living, Afforestation and Bio-diversity, Education, Urbanization and Rural Development, Governance, Bureaucracy, laws and Justice.",
      "domains": [
        "Food", "Water", "Air", "Energy", "Waste Management",
        "Habitat and Livelihood", "Healthy and Natural living",
        "Afforestation and Bio-diversity", "Education",
        "Urbanization and Rural Development", "Governance",
        "Bureaucracy", "Laws and Justice"
      ],
      "five_ps": [
        {
          "key": "P-1",
          "name": "Planet",
          "subtitle": "Environmental Sustainability",
          "description": "Protection of natural resources, water, vegetation, soil, renewable energy acceleration (solar, wind, biomass, tidal), biogas, and waste recycling."
        },
        {
          "key": "P-2",
          "name": "People",
          "subtitle": "Social Sustainability",
          "description": "Empowering weaker and backward tribal communities, participatory decision making, dynamic education, and healthcare access."
        },
        {
          "key": "P-3",
          "name": "Prosperity",
          "subtitle": "Economic Sustainability",
          "description": "Low-cost high-yield eco-farming, women SHG cooperatives, mobile livestock care, and village-level employment."
        },
        {
          "key": "P-4",
          "name": "Peace & Well being",
          "subtitle": "Social Harmony & Health",
          "description": "Nurturing ethical responsibility, holistic well-being, community mutual aid, and peaceful conflict resolution."
        },
        {
          "key": "P-5",
          "name": "Partnership",
          "subtitle": "Collaborative Ecosystems",
          "description": "Cross-sectoral networks linking volunteers, Gram Panchayats, research organizations, and government schemes."
        }
      ],
      "sixth_p": {
        "key": "P-6",
        "name": "Political Sustainability",
        "subtitle": "Sustainable Governance",
        "description": "The foundational enabler: the 5Ps can be sustained through transparent, decentralized, and accountable governance."
      },
      "highlights": [
        "To prepare a dynamic Vision Document for putting India to a sustainable development path with time bound action plan.",
        "The start date of the mission is assumed as 15th August, 2022. (Finish date is the date by which the country should be broadly on a sustainable development path)",
        "Aligned with 5 dimensions of Sustainability (Planet, People, Prosperity, Peace and Partnership).",
        "National sustainability to be achieved by making every activity sustainable.",
        "Proposes structural changes in Governance, Bureaucracy, Judiciary, Education and other domains.",
        "De-growth of over developed places and sustainable development of villages.",
        "Citizens as the \"Central Pillar\" of democracy to exercise their duties."
      ]
    }',
    '[
      {
        "id": "environmental",
        "title": "Environmental & Renewable Energy",
        "category": "ENVIRONMENTAL",
        "icon": "Leaf",
        "summary": "10 core mandates focused on clean energy transition, resource conservation, and ecological preservation.",
        "mandates": [
          "To develop and identify organizations who are capable of implementing the Green projects.",
          "To supervise the Green project to ensure that the project is implemented at grass-root level.",
          "To awaken the ethical and moral responsibility of each individual towards energy conservation and environmental preservation.",
          "To explain how non-depleting and non-polluting alternate energy sources such as solar energy, tidal or ocean energy can reverse environmental degradation.",
          "To spearhead several initiatives using various channels of communication to generate, mould public opinion, influence policy and create awareness about these issues through seminars, conferences, workshops, energy audits, exhibitions and publication of magazines.",
          "To encourage and publish new products, processes, case studies and scenarios, to achieve the goals of Energy conservation and Environmental preservation.",
          "To realize the benefits of development through a path of minimum damage to the environment by adopting the road of Energy Efficiency and Conservation and deploying different forms of sustainable energy in the larger interest of mankind.",
          "To promote and introduce water and soil conservation practices amongst villagers and train them on all technical levels to carry out the same.",
          "To motivate the farmers to use bio-compost to the exclusion of all chemicals and to use only bio-pest management systems.",
          "To introduce recycling technology for solid waste management."
        ]
      },
      {
        "id": "livelihood",
        "title": "Innovative Livelihood",
        "category": "INNOVATIVE LIVELIHOOD",
        "icon": "Briefcase",
        "summary": "6 core mandates empowering rural artisans, cattle keepers, women cooperatives, and arresting village migration.",
        "mandates": [
          "To develop sustainable, innovative livelihood opportunities in spheres of agriculture, live-stock, education, small-scale industry and related vocational services.",
          "To promote Mobile live-stock Hospital.",
          "To establish processing units managed by women cooperatives / SHG’s.",
          "To check migration by providing immediate employment opportunities eg. Construction of water harvesting structures.",
          "To promote and provide improved species of cattle for Livestock Development.",
          "To promote small-scale cottage and village industries."
        ]
      },
      {
        "id": "agriculture",
        "title": "Agricultural Development",
        "category": "AGRICULTURAL DEVELOPMENT",
        "icon": "Sprout",
        "summary": "4 core mandates pioneering technologically sound, low-cost organic agriculture and dairy training.",
        "mandates": [
          "To introduce sustainable and technologically sound systems of agriculture and increase production thereby.",
          "To develop a model of low cost high-yield, environment-friendly farming practices.",
          "To promote Organic Farming.",
          "To established Organic, Dairy Farm & Training Centre."
        ]
      },
      {
        "id": "gov_mobilization",
        "title": "Govt. Resource Mobilization",
        "category": "GOVT. RESOURCE MOBILIZATION",
        "icon": "Users",
        "summary": "7 core mandates linking Gram Panchayats, hamlet communities, schemes, and grass-roots para-professionals.",
        "mandates": [
          "Engage in Lobby/ advocacy with Government to alleviate poverty.",
          "To make available subsidies and Grants and support schemes for the whole community.",
          "To ensure the community participation in village development programmes.",
          "To ensure the community participation in implementation, planning & monitoring.",
          "To create awareness among the community about Go’s & NGO’s Scheme.",
          "To help from village & Hamlets level in programmes through local Gram Panchayat.",
          "To develop village level Para professional in different sectors."
        ]
      }
    ]',
    TRUE
);
