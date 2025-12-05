
/**
 * @deprecated
 * DEPRECATION NOTICE:
 * This hook is obsolete. Routing is now fully handled via 'react-router-dom' 
 * and the 'createHashRouter' configuration in App.tsx.
 * 
 * This file remains as a placeholder to prevent import errors during 
 * hot-module-replacement but contains no logic.
 */
export const useRouter = () => {
  console.warn("useRouter is deprecated. Use useNavigate or useParams from react-router-dom.");
  return {};
};
