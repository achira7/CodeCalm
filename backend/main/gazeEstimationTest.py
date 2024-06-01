from gazetimation import Gazetimation
import cv2

gz = Gazetimation() # or any other device id
#gz.run()

# Load the image from the same directory
image_path = 'gaze.jpg'
image = cv2.imread(image_path)

gz.run(image)


# Print the gaze coordinates
#print(f"Gaze coordinates: {gaze_result}")
