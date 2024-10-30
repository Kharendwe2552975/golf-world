import { Box, Button, Modal, Typography } from '@mui/material';
import { useBall } from './ball/ball-provider';

const textures = [
  { name: 'White', path: '/whiteBall.png' },
  { name: 'Red', path: '/redBall.png' },
  { name: 'Green', path: '/greenBall.png' },
  { name: 'Orange', path: '/orangeBall.png' },
  { name: 'Purple', path: '/purpleBall.png' },
];

const TextureSelectionModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { setTexture } = useBall();

  const handleTextureSelect = (texturePath: string) => {
    setTexture(texturePath);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        color="white"
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <Typography variant="h4" gutterBottom>
          Select Ball Texture
        </Typography>
        {textures.map((texture) => (
          <Button
            key={texture.name}
            variant="contained"
            onClick={() => handleTextureSelect(texture.path)}
            sx={{ marginBottom: 2, width: 200 }}
          >
            {texture.name}
          </Button>
        ))}
      </Box>
    </Modal>
  );
};

export default TextureSelectionModal;
