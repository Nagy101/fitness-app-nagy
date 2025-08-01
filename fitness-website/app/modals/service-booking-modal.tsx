"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ServiceBookingForm } from "@/app/forms/service-booking-form"  
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import axios from "axios"

interface ServiceBookingModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  servicePrice: string
}

interface ServiceBookingData {
  fullName: string
  age: string
  height: string
  country: string
  contactMethod: string
  trainingGoal: string
  trainingFrequency: string
  trainingLocation: string
  homeEquipment: string
  hasInjuries: boolean
  injuryDetails: string
  takingMedication: boolean
  medicationDetails: string
  experiencesDizziness: boolean
  consultedDoctor: boolean
  medicalDetails: string
  currentWorkoutStatus: string
  workoutDescription: string
  jobDescription: string
  experiencesStress: string
  jobType: string
  eatsHealthy: string
  mealsPerDay: string
  sleepHours: string
  additionalInfo: string
  enjoyedExercises: string
}

export function ServiceBookingModal({ isOpen, onClose, serviceName, servicePrice }: ServiceBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (formData: ServiceBookingData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const token = sessionStorage.getItem("token")

      const bookingData = {
        serviceName,
        servicePrice,
        ...formData,
      }

      console.log("Submitting service booking:", bookingData)

      const response = await axios.post(`${baseURL}/services/book`, bookingData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Booking response:", response.data)

      if (response.data.status === "success") {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          setSubmitStatus("idle")
        }, 2000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(response.data.message || "Booking failed")
      }
    } catch (error: any) {
      console.error("Booking error:", error)
      setSubmitStatus("error")
      setErrorMessage(error.response?.data?.message || "Failed to submit booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setSubmitStatus("idle")
      setErrorMessage("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Service Booking Form</DialogTitle>
        </DialogHeader>

        {submitStatus === "success" && (
          <div className="p-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-medium">Booking submitted successfully!</p>
                  <p className="text-sm">
                    We've received your booking request for {serviceName}. Our team will contact you within 24 hours to
                    confirm your booking and discuss the next steps.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-6">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-2">
                  <p className="font-medium">Booking submission failed</p>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {submitStatus === "idle" && (
          <ServiceBookingForm
            serviceName={serviceName}
            servicePrice={servicePrice}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
