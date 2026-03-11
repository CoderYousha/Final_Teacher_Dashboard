import CourseFiles from "../pages/courses/CourseFiles";
import Courses from "../pages/courses/Courses";
import Exams from "../pages/courses/Exams";
import Options from "../pages/courses/Options";
import Questions from "../pages/courses/Questions";
import PathCourses from "../pages/paths/PathCourses";

function CoursesRoutes () {
    return [
        {
            path: '/courses',
            element: <Courses />
        },
        {
            path: '/courses/:id/files',
            element: <CourseFiles />
        },
        {
            path: '/courses/:id/exams',
            element: <Exams />
        },
        {
            path: '/courses/:course_id/exams/:exam_id/questions',
            element: <Questions />
        },
        {
            path: '/courses/:course_id/exams/:exam_id/questions/:question_id/options',
            element: <Options />
        },
        {
            path: "courses/paths/:path_id",
            element: <PathCourses />,
        },
    ];
}

export default CoursesRoutes;