export function usePopups() {
    function setPopup(type, display) {
        if(type){
            document.getElementById(type).style.display = display;
        }
    }

    return { setPopup };
}