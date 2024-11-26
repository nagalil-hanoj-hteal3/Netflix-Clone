export const calculateAge = (birthday, deathday) => {
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    const dayDiff = endDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

export const getGenderInfo = (genderCode) => {
    switch (genderCode) {
        case 0:
            return {
                text: "Not Specified",
                color: "text-white"
            };
        case 1:
            return {
                text: "Female",
                color: "text-white"
            };
        case 2:
            return {
                text: "Male",
                color: "text-white"
            };
        case 3:
            return {
                text: "Non-Binary",
                color: "text-white"
            };
        default:
            return {
                text: "Not Specified",
                color: "text-white"
            };
    }
};