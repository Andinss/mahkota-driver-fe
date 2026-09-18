"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Radio } from "@/components/ui/radio";
import { sanitizeEmailInput } from "@/lib/utils/validation";
import { provinsi, kabupaten, kecamatan, desa } from 'daftar-wilayah-indonesia';

export interface ContactInfoData {
  emergencyContactName: string;
  emergencyContactRelationship: string;
  addressType: string;
  readySignContract: string;
  willingToBeSurveyed: string;
  email?: string;
  phoneNumber?: string;
  province?: string;
  province_name?: string;
  city?: string;
  city_name?: string;
  district?: string;
  district_name?: string;
  subdistrict?: string;
  subdistrict_name?: string;
  fullAddress?: string;
}

interface FormErrors {
  emergencyContactNumber?: string;
  emergencyContactEmail?: string;
  house?: string;
  readyToSignContract?: string;
  willingToBeSurveyed?: string;
  province?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  fullAddress?: string;
}

interface Region {
  id: string;
  name: string;
}

interface ContactInfoFormProps {
  onNext: (data: ContactInfoData) => void;
  onBack: () => void;
  onSaveDraft?: () => void;
  initialData?: ContactInfoData;
}

export function ContactInfoForm({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
}: ContactInfoFormProps) {
  const [readyToSignContract, setReadyToSignContract] = useState<string>(initialData?.readySignContract || "");
  const [willingToBeSurveyed, setWillingToBeSurveyed] = useState<string>(initialData?.willingToBeSurveyed || "");
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [subdistricts, setSubdistricts] = useState<Region[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>(initialData?.province || "");
  const [selectedCity, setSelectedCity] = useState<string>(initialData?.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialData?.district || "");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>(initialData?.subdistrict || "");

  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(initialData?.province_name || "");
  const [selectedCityName, setSelectedCityName] = useState<string>(initialData?.city_name || "");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialData?.district_name || "");
  const [selectedSubdistrictName, setSelectedSubdistrictName] = useState<string>(initialData?.subdistrict_name || "");

  // Load provinces from library 
  useEffect(() => {
    const data = provinsi();
    setProvinces(data.map((p: any) => ({ id: p.kode, name: p.nama })));
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity('');
      return;
    }
    const data = kabupaten(selectedProvince);
    setCities(data.map((c: any) => ({ id: c.kode, name: c.nama })));
  }, [selectedProvince]);

  // Load districts when city changes
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }
    const data = kecamatan(selectedCity);
    setDistricts(data.map((d: any) => ({ id: d.kode, name: d.nama })));
  }, [selectedCity]);

  // Load subdistricts when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setSubdistricts([]);
      setSelectedSubdistrict('');
      return;
    }
    const data = desa(selectedDistrict);
    setSubdistricts(data.map((s: any) => ({ id: s.kode, name: s.nama })));
  }, [selectedDistrict]);

  const validateForm = (): boolean => {
    const formData = new FormData(formRef.current || undefined);
    const newErrors: FormErrors = {};

    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const emergencyContactNumber = formData.get(
      "emergencyContactNumber",
    ) as string;
    const emergencyContactEmail = formData.get(
      "emergencyContactEmail",
    ) as string;
    const house = formData.get("house") as string;

    if (!emergencyContactNumber?.trim()) {
      newErrors.emergencyContactNumber = "Emergency contact number is required";
    } else if (!/^\d{10,15}$/.test(emergencyContactNumber.replace(/\D/g, ""))) {
      newErrors.emergencyContactNumber =
        "Emergency contact number must be 10-15 digits";
    }

    if (!emergencyContactEmail?.trim()) {
      newErrors.emergencyContactEmail = "Emergency contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emergencyContactEmail)) {
      newErrors.emergencyContactEmail = "Please enter a valid email address";
    }

    if (!house) {
      newErrors.house = "Please select house type";
    }

    if (!readyToSignContract) {
      newErrors.readyToSignContract =
        "Please select if you are ready to sign contract";
    }

    if (!willingToBeSurveyed) {
      newErrors.willingToBeSurveyed =
        "Please select if you are willing to be surveyed";
    }

    const province = formData.get("province") as string;
    const city = formData.get("city") as string;
    const district = formData.get("district") as string;
    const subdistrict = formData.get("subdistrict") as string;
    const fullAddress = formData.get("fullAddress") as string;

    if (!province) {
      newErrors.province = "Please select province";
    }
    if (!city) {
      newErrors.city = "Please select city/regency";
    }
    if (!district) {
      newErrors.district = "Please select district";
    }
    if (!subdistrict) {
      newErrors.subdistrict = "Please select subdistrict";
    }
    if (!fullAddress?.trim()) {
      newErrors.fullAddress = "Full address is required";
    } else if (fullAddress.trim().length < 10) {
      newErrors.fullAddress = "Please enter a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data: ContactInfoData = {
      emergencyContactName: formData.get("emergencyContactNumber") as string,
      emergencyContactRelationship: formData.get("emergencyContactEmail",) as string,
      addressType: formData.get("house") as string,
      readySignContract: formData.get("readyToSignContract") as string,
      willingToBeSurveyed: formData.get("willingToBeSurveyed") as string,
      province: formData.get("province") as string,
      province_name: selectedProvinceName,
      city: formData.get("city") as string,
      city_name: selectedCityName,
      district: formData.get("district") as string,
      district_name: selectedDistrictName,
      subdistrict: formData.get("subdistrict") as string,
      subdistrict_name: selectedSubdistrictName,
      fullAddress: formData.get("fullAddress") as string,
    };

    onNext(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">contact_mail</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 2: Contact Information</h3>
          <p className="text-xs text-slate-400">Masukkan data kontak dan alamat driver</p>
        </div>
      </div>

      <form
        ref={formRef}
        id="contactInfoForm"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="emergencyContactNumber"
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="Phone number of emergency contact"
            defaultValue={initialData?.emergencyContactName}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              const nativeInput = e.target;
              nativeInput.value = val;
            }}
            required
            error={errors.emergencyContactNumber}
          />

          <Input
            id="emergencyContactEmail"
            name="emergencyContactEmail"
            label="Emergency Contact Email"
            placeholder="Email address of emergency contact"
            type="email"
            defaultValue={initialData?.emergencyContactRelationship}
            onChange={(e) => {
              const val = sanitizeEmailInput(e.target.value);
              const nativeInput = e.target;
              nativeInput.value = val;
            }}
            required
            error={errors.emergencyContactEmail}
          />

            <div>
              <Select
                id="house"
                name="house"
                label="House"
                defaultValue={initialData?.addressType || ""}
                error={errors.house}
                required
              >
                <option value="">Select house type</option>
                <option value="contract">Contract</option>
                <option value="property_parent">Property Parent</option>
                <option value="own_yourself">Own Yourself</option>
              </Select>
            </div>
            <div>
              <Select
                id="province"
                name="province"
                label="Province"
                value={selectedProvince}
                onChange={(e) => {
                  const provinceId = e.target.value;
                  setSelectedProvince(provinceId);
                  setSelectedCity('');
                  setSelectedDistrict('');
                  setSelectedSubdistrict('');
                  const province = provinces.find(p => p.id === provinceId);
                  setSelectedProvinceName(province?.name || '');
                }}
                error={errors.province}
                required
              >
                <option value="">Select province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City/Regency */}
                <div>
                  <Select
                    id="city"
                    name="city"
                    label="City / Regency"
                    value={selectedCity}
                    onChange={(e) => {
                      const cityId = e.target.value;
                      setSelectedCity(cityId);
                      setSelectedDistrict('');
                      setSelectedSubdistrict('');
                      const city = cities.find(c => c.id === cityId);
                      setSelectedCityName(city?.name || '');
                    }}
                    error={errors.city}
                    disabled={!selectedProvince}
                    required
                  >
                    <option value="">Select city/regency</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* District */}
                <div>
                  <Select
                    id="district"
                    name="district"
                    label="District"
                    value={selectedDistrict}
                    onChange={(e) => {
                      const districtId = e.target.value;
                      setSelectedDistrict(districtId);
                      setSelectedSubdistrict('');
                      const district = districts.find(d => d.id === districtId);
                      setSelectedDistrictName(district?.name || '');
                    }}
                    error={errors.district}
                    disabled={!selectedCity}
                    required
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Subdistrict */}
                <div>
                  <Select
                    id="subdistrict"
                    name="subdistrict"
                    label="Subdistrict"
                    value={selectedSubdistrict}
                    onChange={(e) => {
                      const subdistrictId = e.target.value;
                      setSelectedSubdistrict(subdistrictId);
                      const subdistrict = subdistricts.find(s => s.id === subdistrictId);
                      setSelectedSubdistrictName(subdistrict?.name || '');
                    }}
                    error={errors.subdistrict}
                    disabled={!selectedDistrict}
                    required
                  >
                    <option value="">Select subdistrict</option>
                    {subdistricts.map((subdistrict) => (
                      <option key={subdistrict.id} value={subdistrict.id}>
                        {subdistrict.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Full Address */}
                <div className="md:col-span-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5"
                      htmlFor="fullAddress"
                    >
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`w-full rounded-lg border bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary h-auto ${errors.fullAddress ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#dbe0e6] dark:border-[#4b5563]"}`}
                      placeholder="Enter complete address (street name, building number, RT/RW, etc.)"
                      name="fullAddress"
                      id="fullAddress"
                      rows={3}
                      defaultValue={initialData?.fullAddress || ""}
                    />
                    {errors.fullAddress && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Willing To Be Surveyed */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Willing To Be Surveyed <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <Radio
                      id="willingToSurveyYes"
                      name="willingToBeSurveyed"
                      value="true"
                      label="Yes"
                      checked={willingToBeSurveyed === "true"}
                      onChange={(e) => setWillingToBeSurveyed(e.target.value)}
                    />
                    <Radio
                      id="willingToSurveyNo"
                      name="willingToBeSurveyed"
                      value="false"
                      label="No"
                      checked={willingToBeSurveyed === "false"}
                      onChange={(e) => setWillingToBeSurveyed(e.target.value)}
                    />
                  </div>
                  {errors.willingToBeSurveyed && (
                    <p className="text-xs text-red-500">
                      {errors.willingToBeSurveyed}
                    </p>
                  )}
                </div>

                {/* Ready To Sign Contract */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ready To Sign Contract <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <Radio
                      id="readyToSignYes"
                      name="readyToSignContract"
                      value="true"
                      label="Yes"
                      checked={readyToSignContract === "true"}
                      onChange={(e) => setReadyToSignContract(e.target.value)}
                    />
                    <Radio
                      id="readyToSignNo"
                      name="readyToSignContract"
                      value="false"
                      label="No"
                      checked={readyToSignContract === "false"}
                      onChange={(e) => setReadyToSignContract(e.target.value)}
                    />
                  </div>
                  {errors.readyToSignContract && (
                    <p className="text-xs text-red-500">
                      {errors.readyToSignContract}
                    </p>
                  )}
                </div>
              </div>
            </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Back
          </button>
          <Button
            variant="primary"
            type="submit"
            form="contactInfoForm"
            icon="arrow_forward"
            iconPosition="right"
          >
            Next Step
          </Button>
        </div>
      </form>
    </div>
  );
}
