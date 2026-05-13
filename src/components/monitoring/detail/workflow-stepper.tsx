"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface WorkflowStepperProps {
  onStartRetrieval?: () => void;
}

export const WorkflowStepper = ({ onStartRetrieval }: WorkflowStepperProps) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const steps = [
    { name: "Assigned", icon: "check", status: currentStep >= 0 ? "completed" : "pending" },
    { name: "En Route", icon: "directions_car", status: currentStep >= 1 ? "completed" : "pending" },
    { name: "On Scene", icon: "location_on", status: currentStep >= 2 ? "completed" : currentStep === 2 ? "current" : "pending" },
    { name: "Retrieving", icon: "auto_towing", status: currentStep >= 3 ? "completed" : currentStep === 3 ? "current" : "pending" },
    { name: "Completed", icon: "flag", status: currentStep >= 4 ? "completed" : currentStep === 4 ? "current" : "pending" },
  ];

  const completedCount = steps.filter(s => s.status === "completed").length;
  const progressPercentage = (completedCount / steps.length) * 100;

  const handleStartRetrieval = () => {
    if (onStartRetrieval) {
      onStartRetrieval();
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
          <div className="h-12 bg-slate-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 p-6">
      <h3 className="font-bold text-[#0d141b] dark:text-white mb-6">Workflow Status</h3>
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#e7edf3] dark:bg-gray-700 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 px-2">
            <div className={`
              size-8 rounded-full flex items-center justify-center
              ${step.status === "completed" || step.status === "current" 
                ? "bg-primary text-white" 
                : "bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-gray-500"}
              ${step.status === "current" ? "ring-4 ring-blue-100 dark:ring-blue-900/50" : ""}
            `}>
              <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
            </div>
            <p className={`
              text-xs font-bold
              ${step.status === "completed" || step.status === "current" 
                ? "text-primary" 
                : "text-slate-400 dark:text-gray-500 font-medium"}
            `}>
              {step.name}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        {currentStep === 2 && (
          <Button
            variant="primary"
            icon="arrow_forward"
            iconPosition="right"
            onClick={handleStartRetrieval}
          >
            Start Retrieval
          </Button>
        )}
        {currentStep === 3 && (
          <Button
            variant="success"
            icon="check_circle"
            onClick={() => setCurrentStep(4)}
          >
            Mark as Completed
          </Button>
        )}
        {currentStep === 4 && (
          <div className="flex items-center gap-2 text-green-600">
            <span className="material-symbols-outlined">verified</span>
            <span className="text-sm font-semibold">Retrieval Completed</span>
          </div>
        )}
      </div>
    </div>
  );
};