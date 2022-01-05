package com.doctor;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import io.wazo.callkeep.RNCallKeepModule;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }

  @Override
  protected String getMainComponentName() {
    return "doctor";
  }
  @Override
    public void onRequestPermissionsResult(int requestCode,  String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case RNCallKeepModule.REQUEST_READ_PHONE_STATE:
                RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
                break;
        }
    }
}
