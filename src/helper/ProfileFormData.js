export function buildProfileFormData({
     firstName,
     lastName,
     phoneCode,
     phoneNumber,
     birthDate,
     email,
     language,
     image,
     specialization,
     academicDegree,
     experienceYears,
     major,
}) {
     const formData = new FormData();

     formData.append('first_name', firstName);
     formData.append('last_name', lastName);
     formData.append('phone_code', phoneCode);
     formData.append('phone', phoneNumber);
     formData.append('email', email);
     formData.append('language', language);
     formData.append('specialization_id', specialization);
     formData.append('academic_degree_id', academicDegree);
     formData.append('experience_years', experienceYears);
     formData.append('major_id', major);
     if (image)
          formData.append('image', image);
     if (birthDate)
          formData.append('birth_date', birthDate);
     return formData;
}