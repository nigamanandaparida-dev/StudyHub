import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Stars,
    ArrowRight,
    FileEdit,
    Smile,
    Users,
} from 'lucide-react';

const ContentCard = ({ image, title, badge }) => (
    <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/5">
        <img
            src={image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4">
            <p
                className="text-white font-bold text-lg leading-tight"
                dangerouslySetInnerHTML={{ __html: title }}
            />
            <span className="text-xs text-emerald-400/80 font-medium">{badge}</span>
        </div>
    </div>
);


const Home = () => {
    return (
        <div className="flex flex-col min-h-screen ">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-[#12181b] text-slate-100 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">

                    <div className="md:w-1/2 md:pr-12 text-center md:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase w-fit mb-8">
                            <Stars />
                            Joined by 50,000+ students
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 lg:text-7xl"
                        >
                            Mastering <br />
                            Exams <br />
                            <span className=" bg-clip-text bg-gradient-to-r text-emerald-500">
                                Together.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-slate-400 mb-10 max-w-lg mx-auto md:mx-0"
                        >
                            The ultimate platform for students to collaborate, share study materials, and take a break with some humor.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
                        >
                            <Link
                                to="/upload"
                                className="bg-emerald-500 text-[#12181b] px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2"
                            >
                                Upload Notes
                                <ArrowRight />
                            </Link>
                            <Link
                                to="/explore"
                                className="border border-white/10 px-8 py-4 rounded-xl text-lg font-bold bg-blue-500 transition-all transform hover:-translate-y-1"
                            >
                                Explore Notes
                            </Link>
                        </motion.div>
                    </div>

                    <div className="md:w-1/2 mt-12 md:mt-0 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                                alt="Students studying"
                                className="w-full h-auto object-cover"
                            />
                        </motion.div>
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob mutation-delay-2000"></div>
                    </div>

                </div>
            </section>

            {/* Features/How it works */}
            <section className="py-20 bg-[#12181b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
                            Everything you need to succeed
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Designed by students, for students.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<FileEdit />}
                            color="bg-emerald-500"
                            title="Collaborative Notes"
                            description="Access high-quality study materials peerreviews by the top students and share your own notes."
                        />
                        <FeatureCard
                            icon={<Smile />}
                            color="bg-blue-500"
                            title="Meme Hub"
                            description="The internet's best student-centric memes curated by the students like you. Beacause sometime you just need to laugh at the pain."
                        />
                        <FeatureCard
                            icon={<Users />}
                            color="bg-emerald-500"
                            title="Peer Support"
                            description="Stuck in problems? Our global community ia active 24/7.Get help from students who’ve been there."
                        />
                    </div>
                </div>
            </section>
            <section className="w-full mx-auto px-6 py-12 bg-[#12181b]">
                <div className="flex items-center justify-between mb-8 ">
                    <h2 className="text-4xl font-bold flex items-center gap-2 text-white ml-20">
                        <Stars size={28} strokeWidth={2.5} />
                        Study With Enjoyment
                    </h2>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl ml-23">
                    <ContentCard
                        image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
                        title="MATH<br/>Summary"
                        badge="1.2k Downloads"
                    />
                    <ContentCard
                        image="https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
                        title="PYTHON<br/>"
                        badge="850 Downloads"
                    />
                    <ContentCard
                        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                        title="Finals Week<br/>Mood"
                        badge="Meme of the Day"
                    />
                    <ContentCard
                        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
                        title="Exam Curve<br/>Hits Different"
                        badge="Fresh Meme"
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, color, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="bg-slate-800/30 p-8 rounded-2xl shadow-lg border border-slate-800 flex flex-col items-center text-center hover:border-emerald-400/30 transition-all group"
    >
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-md transform rotate-3`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
);

export default Home;
