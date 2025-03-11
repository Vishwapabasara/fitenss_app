import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // User personal details
    name: '',
    age: '',
    height: '', // in cm
    weight: '', // in kg
    gender: 'male',
    bmi: null,
    bmiCategory: '',
    // Original form data
    goal: '',
    bodyType: '',
    dietaryPreference: '',
    fitnessLevel: 'beginner',
    workoutsPerWeek: 3,
    availableEquipment: []
  });
  const [plan, setPlan] = useState(null);

  const fitnessGoals = [
    { id: 'weightLoss', label: 'Weight Loss', icon: '🔻' },
    { id: 'muscleGain', label: 'Muscle Gain', icon: '💪' },
    { id: 'endurance', label: 'Improve Endurance', icon: '🏃' },
    { id: 'strength', label: 'Increase Strength', icon: '🏋️' },
    { id: 'flexibility', label: 'Improve Flexibility', icon: '🧘' }
  ];

  const bodyTypes = [
    { id: 'ectomorph', label: 'Ectomorph (Slim Build)', icon: '📏' },
    { id: 'mesomorph', label: 'Mesomorph (Athletic Build)', icon: '🏄' },
    { id: 'endomorph', label: 'Endomorph (Fuller Build)', icon: '🧸' }
  ];

  const dietPreferences = [
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'paleo', label: 'Paleo', icon: '🥩' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'omnivore', label: 'No Restrictions', icon: '🍽️' }
  ];

  const equipmentOptions = [
    { id: 'none', label: 'No Equipment' },
    { id: 'dumbbell', label: 'Dumbbells' },
    { id: 'barbell', label: 'Barbell & Weights' },
    { id: 'resistanceBands', label: 'Resistance Bands' },
    { id: 'pullupBar', label: 'Pull-up Bar' },
    { id: 'gym', label: 'Full Gym Access' }
  ];

  // Calculate BMI function
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(bmi * 10) / 10;
    
    let category = '';
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obesity';
    }
    
    return { value: roundedBMI, category };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          [name]: [...formData[name], value]
        });
      } else {
        setFormData({
          ...formData,
          [name]: formData[name].filter(item => item !== value)
        });
      }
    } else if (name === 'height' || name === 'weight') {
      // Update height or weight
      const newFormData = { ...formData, [name]: value };
      
      // Calculate BMI if both height and weight are provided
      if (name === 'height' && newFormData.weight || 
          name === 'weight' && newFormData.height) {
        const bmiResult = calculateBMI(
          name === 'height' ? value : newFormData.height,
          name === 'weight' ? value : newFormData.weight
        );
        
        if (bmiResult) {
          newFormData.bmi = bmiResult.value;
          newFormData.bmiCategory = bmiResult.category;
        }
      }
      
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectGoal = (goalId) => {
    setFormData({ ...formData, goal: goalId });
  };

  const handleSelectBodyType = (bodyTypeId) => {
    setFormData({ ...formData, bodyType: bodyTypeId });
  };

  const handleSelectDiet = (dietId) => {
    setFormData({ ...formData, dietaryPreference: dietId });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const generatePlan = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const planData = {
        userDetails: {
          name: formData.name,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
          bmi: formData.bmi,
          bmiCategory: formData.bmiCategory,
          gender: formData.gender
        },
        workoutPlan: {
          days: [
            {
              day: 'Monday',
              focus: formData.goal === 'muscleGain' ? 'Upper Body' : 'Cardio',
              exercises: [
                { name: 'Push-ups', sets: 3, reps: '10-12', rest: '60 sec' },
                { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '60 sec' },
                { name: formData.goal === 'endurance' ? 'Jump Rope' : 'Shoulder Press', 
                  duration: formData.goal === 'endurance' ? '15 mins' : null,
                  sets: formData.goal === 'endurance' ? null : 3, 
                  reps: formData.goal === 'endurance' ? null : '10-12',
                  rest: '60 sec' }
              ]
            },
            {
              day: 'Wednesday',
              focus: formData.goal === 'muscleGain' ? 'Lower Body' : 'Strength',
              exercises: [
                { name: 'Squats', sets: 3, reps: '12-15', rest: '60 sec' },
                { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60 sec' },
                { name: 'Plank', duration: '30-60 sec', sets: 3, rest: '30 sec' }
              ]
            },
            {
              day: 'Friday',
              focus: formData.goal === 'muscleGain' ? 'Full Body' : 'HIIT',
              exercises: [
                { name: 'Burpees', sets: 3, reps: '10', rest: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec', sets: 3, rest: '30 sec' },
                { name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: '30 sec' }
              ]
            }
          ]
        },
        dietPlan: {
          calories: formData.goal === 'weightLoss' ? 'Deficit of 300-500 calories' : 
                   formData.goal === 'muscleGain' ? 'Surplus of 300-500 calories' : 'Maintenance calories',
          macros: formData.goal === 'muscleGain' ? 
                  { protein: '1.6-2g per kg bodyweight', carbs: '4-5g per kg', fat: '0.8-1g per kg' } :
                  formData.goal === 'weightLoss' ?
                  { protein: '1.8-2.2g per kg bodyweight', carbs: '2-3g per kg', fat: '0.5-0.8g per kg' } :
                  { protein: '1.2-1.6g per kg bodyweight', carbs: '3-4g per kg', fat: '0.8-1g per kg' },
          meals: [
            {
              name: 'Breakfast',
              example: formData.dietaryPreference === 'vegan' ? 
                      'Tofu scramble with vegetables and whole grain toast' :
                      formData.dietaryPreference === 'keto' ?
                      'Avocado and eggs with spinach' :
                      'Greek yogurt with berries and nuts'
            },
            {
              name: 'Lunch',
              example: formData.dietaryPreference === 'vegan' ? 
                      'Quinoa bowl with roasted vegetables and chickpeas' :
                      formData.dietaryPreference === 'keto' ?
                      'Chicken salad with olive oil dressing' :
                      'Turkey wrap with vegetables and hummus'
            },
            {
              name: 'Dinner',
              example: formData.dietaryPreference === 'vegan' ? 
                      'Lentil curry with brown rice' :
                      formData.dietaryPreference === 'keto' ?
                      'Salmon with asparagus and avocado' :
                      'Grilled chicken with sweet potato and broccoli'
            }
          ]
        },
        statistics: {
          workoutsPerWeek: formData.workoutsPerWeek,
          fitnessLevel: formData.fitnessLevel,
          equipment: formData.availableEquipment
        }
      };
      
      setPlan(planData);
      setLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="step-container">
            <h2>Tell us about yourself</h2>
            <div className="form-group">
              <label>Your Name:</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="user-input"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label>Your Age:</label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                className="user-input"
                placeholder="Enter your age"
                min="16"
                max="99"
              />
            </div>
            
            <div className="form-group">
              <label>Gender:</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                className="select-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Height (cm):</label>
              <input 
                type="number" 
                name="height" 
                value={formData.height} 
                onChange={handleChange} 
                className="user-input"
                placeholder="Enter your height in cm"
                min="100"
                max="250"
              />
            </div>
            
            <div className="form-group">
              <label>Weight (kg):</label>
              <input 
                type="number" 
                name="weight" 
                value={formData.weight} 
                onChange={handleChange} 
                className="user-input"
                placeholder="Enter your weight in kg"
                min="30"
                max="300"
              />
            </div>
            
            {formData.bmi && (
              <div className="bmi-display">
                <h4>Your Body Mass Index</h4>
                <div className="bmi-value">{formData.bmi}</div>
                <div className="bmi-category">{formData.bmiCategory}</div>
              </div>
            )}
            
            <div className="navigation-buttons">
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!formData.name || !formData.age || !formData.height || !formData.weight}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-container">
            <h2>What's your primary fitness goal?</h2>
            <div className="options-grid">
              {fitnessGoals.map(goal => (
                <div 
                  key={goal.id}
                  className={`option-card ${formData.goal === goal.id ? 'selected' : ''}`}
                  onClick={() => handleSelectGoal(goal.id)}
                >
                  <div className="card-icon">{goal.icon}</div>
                  <h3>{goal.label}</h3>
                </div>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!formData.goal}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <h2>What's your body type?</h2>
            <div className="options-grid">
              {bodyTypes.map(type => (
                <div 
                  key={type.id}
                  className={`option-card ${formData.bodyType === type.id ? 'selected' : ''}`}
                  onClick={() => handleSelectBodyType(type.id)}
                >
                  <div className="card-icon">{type.icon}</div>
                  <h3>{type.label}</h3>
                </div>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!formData.bodyType}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-container">
            <h2>What are your dietary preferences?</h2>
            <div className="options-grid">
              {dietPreferences.map(diet => (
                <div 
                  key={diet.id}
                  className={`option-card ${formData.dietaryPreference === diet.id ? 'selected' : ''}`}
                  onClick={() => handleSelectDiet(diet.id)}
                >
                  <div className="card-icon">{diet.icon}</div>
                  <h3>{diet.label}</h3>
                </div>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="next-button" 
                onClick={nextStep}
                disabled={!formData.dietaryPreference}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-container">
            <h2>Additional Details</h2>
            <div className="form-group">
              <label>Your Fitness Level:</label>
              <select 
                name="fitnessLevel" 
                value={formData.fitnessLevel} 
                onChange={handleChange}
                className="select-input"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Workouts Per Week:</label>
              <div className="range-container">
                <input 
                  type="range" 
                  min="1" 
                  max="7" 
                  name="workoutsPerWeek" 
                  value={formData.workoutsPerWeek} 
                  onChange={handleChange}
                  className="range-input"
                />
                <span className="range-value">{formData.workoutsPerWeek}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label>Available Equipment:</label>
              <div className="checkbox-group">
                {equipmentOptions.map(item => (
                  <div className="checkbox-item" key={item.id}>
                    <input 
                      type="checkbox" 
                      id={item.id} 
                      name="availableEquipment" 
                      value={item.id} 
                      checked={formData.availableEquipment.includes(item.id)}
                      onChange={handleChange}
                    />
                    <label htmlFor={item.id}>{item.label}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button 
                className="generate-button"
                onClick={generatePlan}
              >
                Generate My Plan
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>FitPlan AI</h1>
        <p>Personalized workout & nutrition plans based on your goals</p>
      </header>

      {!plan ? (
        <div className="form-container">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(step / 5) * 100}%` }}></div>
            </div>
            <div className="steps-indicator">
              <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3</div>
              <div className={`step-indicator ${step >= 4 ? 'active' : ''}`}>4</div>
              <div className={`step-indicator ${step >= 5 ? 'active' : ''}`}>5</div>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Creating your personalized plan...</p>
            </div>
          ) : (
            renderStep()
          )}
        </div>
      ) : (
        <div className="plan-container">
          <h2>Your Personalized Fitness Plan</h2>
          
          {/* User Details Section with updated CSS */}
          <div className="user-details-container">
            <h3>Your Profile</h3>
            <div className="profile-image-container">
              <div className="profile-image">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button className="upload-image-button">Upload Photo</button>
            </div>
            
            <div className="user-details-grid">
              <div className="user-details-field">
                <label>Name</label>
                <p>{plan.userDetails.name}</p>
              </div>
              <div className="user-details-field">
                <label>Age</label>
                <p>{plan.userDetails.age}</p>
              </div>
              <div className="user-details-field">
                <label>Gender</label>
                <p>{plan.userDetails.gender.charAt(0).toUpperCase() + plan.userDetails.gender.slice(1)}</p>
              </div>
              <div className="user-details-field">
                <label>Height</label>
                <p>{plan.userDetails.height} cm</p>
              </div>
              <div className="user-details-field">
                <label>Weight</label>
                <p>{plan.userDetails.weight} kg</p>
              </div>
            </div>
            
            {plan.userDetails.bmi && (
              <div className="bmi-display">
                <h4>Your Body Mass Index</h4>
                <div className="bmi-value">{plan.userDetails.bmi}</div>
                <div className="bmi-category">{plan.userDetails.bmiCategory}</div>
              </div>
            )}
            
            <div className="user-stats-summary">
              <div className="stat-card">
                <h5>Fitness Level</h5>
                <div className="stat-value">{plan.statistics.fitnessLevel.charAt(0).toUpperCase() + plan.statistics.fitnessLevel.slice(1)}</div>
              </div>
              <div className="stat-card">
                <h5>Weekly Workouts</h5>
                <div className="stat-value">{plan.statistics.workoutsPerWeek}</div>
              </div>
              <div className="stat-card">
                <h5>Equipment</h5>
                <div className="stat-value">{plan.statistics.equipment.length || "None"}</div>
              </div>
            </div>
            
            <div className="user-details-actions">
              <button className="edit-details-button">Edit Profile</button>
            </div>
          </div>
          
          {/* Workout Plan Section */}
          <div className="plan-section">
            <h3>Workout Plan</h3>
            <div className="workout-days">
              {plan.workoutPlan.days.map((day, index) => (
                <div className="workout-day" key={index}>
                  <h4>{day.day} - {day.focus}</h4>
                  <div className="exercises">
                    {day.exercises.map((exercise, idx) => (
                      <div className="exercise" key={idx}>
                        <p className="exercise-name">{exercise.name}</p>
                        <div className="exercise-details">
                          {exercise.sets && <span>{exercise.sets} sets</span>}
                          {exercise.reps && <span>{exercise.reps}</span>}
                          {exercise.duration && <span>{exercise.duration}</span>}
                          {exercise.rest && <span>Rest: {exercise.rest}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Nutrition Plan Section */}
          <div className="plan-section">
            <h3>Nutrition Plan</h3>
            <div className="nutrition-overview">
              <div className="nutrition-card">
                <h4>Daily Calories</h4>
                <p>{plan.dietPlan.calories}</p>
              </div>
              <div className="nutrition-card">
                <h4>Macros</h4>
                <p>Protein: {plan.dietPlan.macros.protein}</p>
                <p>Carbs: {plan.dietPlan.macros.carbs}</p>
                <p>Fat: {plan.dietPlan.macros.fat}</p>
              </div>
            </div>
            
            <h4>Sample Meal Plan</h4>
            <div className="meals">
              {plan.dietPlan.meals.map((meal, index) => (
                <div className="meal-card" key={index}>
                  <h5>{meal.name}</h5>
                  <p>{meal.example}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button 
              className="back-button"
              onClick={() => {
                setPlan(null);
                setStep(1);
              }}
            >
              Create New Plan
            </button>
            <button className="next-button">
              Download Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;