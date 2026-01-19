
import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import { analyzeFoodImage } from './services/geminiService';
import { SnapChefResult } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SnapChefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFoodImage(image);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        {/* Intro Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl font-serif text-stone-900">What's in your fridge?</h2>
          <p className="text-stone-600">Snap a photo of your ingredients or leftovers and let AI suggest your next favorite meal.</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            {!image ? (
              <label className="w-full h-64 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all">
                <div className="text-stone-400 mb-2">
                  <i className="fa-solid fa-camera text-4xl"></i>
                </div>
                <span className="text-stone-600 font-medium">Upload or take a photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </label>
            ) : (
              <div className="relative w-full max-w-md">
                <img 
                  src={image} 
                  alt="Food Preview" 
                  className="w-full h-auto rounded-2xl object-cover shadow-lg border-4 border-white" 
                />
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute -top-3 -right-3 bg-stone-900 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-stone-700 transition"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}

            {image && !result && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`px-8 py-3 bg-orange-500 text-white rounded-full font-semibold shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all flex items-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Cooking up ideas...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Analyze Ingredients</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center space-x-3">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Left: Ingredients & Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
                <h3 className="font-semibold text-stone-800 flex items-center">
                  <i className="fa-solid fa-magnifying-glass text-orange-500 mr-2"></i>
                  Identified
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.identifiedIngredients.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
                <h3 className="font-semibold text-orange-800 flex items-center">
                  <i className="fa-solid fa-chart-simple mr-2"></i>
                  Macros Estimate
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-xl font-bold text-stone-800">{result.suggestedRecipe.macros.calories}</div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Calories</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-xl font-bold text-stone-800">{result.suggestedRecipe.macros.protein}</div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Protein</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-xl font-bold text-stone-800">{result.suggestedRecipe.macros.carbs}</div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Carbs</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-xl font-bold text-stone-800">{result.suggestedRecipe.macros.fat}</div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Fat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Recipe */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif text-stone-900">{result.suggestedRecipe.title}</h2>
                  <p className="text-stone-500 italic">"{result.suggestedRecipe.description}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-stone-800 uppercase tracking-widest text-xs border-b pb-2">Ingredients Needed</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {result.suggestedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start text-stone-700 text-sm">
                        <i className="fa-solid fa-check text-green-500 mr-2 mt-1"></i>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-stone-800 uppercase tracking-widest text-xs border-b pb-2">Preparation Steps</h4>
                  <ol className="space-y-4">
                    {result.suggestedRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex space-x-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <p className="text-stone-700 pt-1 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="pt-6">
                  <button className="w-full py-4 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:border-orange-500 hover:text-orange-500 transition">
                    <i className="fa-solid fa-print mr-2"></i> Print Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
