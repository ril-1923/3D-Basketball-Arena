export default function ArenaLights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#b8c8ff" />
      <directionalLight position={[8, 20, 6]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-17} shadow-camera-right={17} shadow-camera-top={11} shadow-camera-bottom={-11} />
      <spotLight position={[-8, 15, 0]} angle={0.7} penumbra={0.6} intensity={350} color="#dfe8ff" />
      <spotLight position={[8, 15, 0]} angle={0.7} penumbra={0.6} intensity={350} color="#fff1dc" />
    </>
  );
}
