package Handsoff.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.usb.UsbDevice;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.PowerManager;
import android.telecom.TelecomManager;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.text.method.ScrollingMovementMethod;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import android.hardware.usb.UsbDevice;
import android.os.Bundle;
import android.os.Handler;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;

import Handsoff.app.newarchitecture.EventEmitter;
import me.aflak.arduino.Arduino;
import me.aflak.arduino.ArduinoListener;

import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity implements ArduinoListener{
//  Backend code place
  //For Permissions
  private final int ANSWER_PHONE_CALLS_PERMISSION = 1;

  private Arduino arduino;
  private TextView textView;
  private String message = "";
  private boolean isInForeground = false;
  private Boolean connectionState;

  //To handle Volume Control
  private AudioManager audio;

  private int phoneState = TelephonyManager.CALL_STATE_IDLE;

  private PhoneStateListener mPhoneStateListener = new PhoneStateListener() {
    @Override
    public void onCallStateChanged(int state, String incomingNumber) {
      phoneState = state;
    }
  };

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
    arduino = new Arduino(this);

    //To Handle Volume Control
    audio = (AudioManager) getSystemService(Context.AUDIO_SERVICE);

    //startService(new Intent(this, MyService.class));

    TelephonyManager telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
    telephonyManager.listen(mPhoneStateListener, PhoneStateListener.LISTEN_CALL_STATE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      requestPhonePermission();
    }
    if (Build.VERSION.SDK_INT >= 21) {
      View decorView = getWindow().getDecorView();
      int option = View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
      decorView.setSystemUiVisibility(option);
      getWindow().setNavigationBarColor(Color.TRANSPARENT);
      getWindow().setStatusBarColor(Color.TRANSPARENT);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  private void requestPhonePermission() {
    if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.ANSWER_PHONE_CALLS)) {
      new AlertDialog.Builder(this)
              .setTitle("Permission needed")
              .setMessage("This permissions is needed to accept and decline Phone Calls")
              .setPositiveButton("ok", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                  ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ANSWER_PHONE_CALLS}, ANSWER_PHONE_CALLS_PERMISSION);
                }
              })
              .setNegativeButton("cancel", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                  dialogInterface.dismiss();
                }
              })
              .create().show();
      Log.d("onstart", "onStart: run the dialog if");
    } else {
      ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ANSWER_PHONE_CALLS}, ANSWER_PHONE_CALLS_PERMISSION);
      Log.d("onstart", "onStart: run the dialog else");

    }
  }

  @Override
  protected void onStart() {
    super.onStart();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      if (ContextCompat.checkSelfPermission(MainActivity.this,
              Manifest.permission.ANSWER_PHONE_CALLS) == PackageManager.PERMISSION_GRANTED) {
        Toast.makeText(MainActivity.this, "Allready Permission", Toast.LENGTH_SHORT).show();
      } else {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          requestPhonePermission();
        }
      }
    }
    arduino.setArduinoListener(this);
    Log.d("test",String.valueOf("test"));
  };


  @SuppressLint("MissingSuperCall")
  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    if (requestCode == ANSWER_PHONE_CALLS_PERMISSION) {
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        Toast.makeText(this, "Permission Granted", Toast.LENGTH_SHORT).show();
      } else {
        Toast.makeText(this, "Permission Declined", Toast.LENGTH_SHORT).show();
      }
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    //Variable to check if App is in Foreground
    isInForeground = true;
  }

  @Override
  protected void onPause() {
    super.onPause();
    isInForeground = false;
  }



  @Override
  protected void onDestroy() {
    super.onDestroy();

    //Unlinkes the Arduino and closes the Serial port
    arduino.unsetArduinoListener();
    arduino.close();
  }

  //Method which is called when arduino is attached
  @Override
  public void onArduinoAttached(UsbDevice device){
    display("Arduino attached!");
    arduino.open(device);
  }

  //Method which is called when Arduino is detached
  @Override
  public void onArduinoDetached() {
    display("Arduino detached");
    connectionState = false;
    EventEmitter.sendEvent("connectionState",connectionState);
  }

  //When there is Data transmitted by the Arduino this method is called
  @Override
  public void onArduinoMessage(byte[] bytes) {
    message = new String(bytes);
    display("> " + message);
    try {
      executeCommand();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void onArduinoOpened() {
    String str = "Arduino Open\n";
    connectionState = true;
    EventEmitter.sendEvent("connectionState",connectionState);
    arduino.send(str.getBytes());
  }

  @Override
  public void onUsbPermissionDenied() {
    display("Permission denied.. New attempt in 3 sec");
    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        arduino.reopen();
      }
    }, 3000);
  }

  public void display(final String msg){
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Log.d("test",msg);
      }
    });
  }

  @SuppressLint("MissingPermission")
  public void executeCommand() throws InterruptedException {
    //Decrease Volume --> Works like a Charm
    if (message.charAt(7) == '1') {
      audio.adjustStreamVolume(AudioManager.STREAM_MUSIC,
              AudioManager.ADJUST_LOWER, AudioManager.FLAG_SHOW_UI);
      display("decrease Volume");
    }
    //Increase Volume --> Works like a Charm
    else if (message.charAt(7) == '2') {

      display("increase Volume");
      audio.adjustStreamVolume(AudioManager.STREAM_MUSIC,
              AudioManager.ADJUST_RAISE, AudioManager.FLAG_SHOW_UI);
    }

    //TODO
    //Wake up Screen
    else if (message.charAt(7) == '3') {
      //Code to wake up the Screen
      PowerManager pm = (PowerManager) getApplicationContext().getSystemService(Context.POWER_SERVICE);

      display("Power");

      //Check if Screen is on
      if (!pm.isInteractive()) {
        PowerManager.WakeLock wakeLock = pm.newWakeLock((PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP), "myApp:wakelocktag");
        wakeLock.acquire(10*60*1000L /*10 minutes*/);
        display("Display Should Awake");
      } else {
        //In Android (regardless of whether you use Kotlin, Java, whatever)
        // for security reasons it is not possible for an app to make the device sleep,
        // unless your app is a system app provided by the phone manufacturer.
        display("Display Should Sleep");
      }
    }

    //TODO
    //Open Maps -- Does not work
    else if (message.charAt(7) == '4') {
      if(!isInForeground){
        //Bring Up App
        //Intent intent = getPackageManager().getLaunchIntentForPackage(getPackageName());
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
        display("Bringing Up App");
        Thread.sleep(500);
      }
      if(isInForeground){
        try {

          Uri gmmIntentUri = Uri.parse("geo:48.24896, 11.65101");
          Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
          mapIntent.setPackage("com.google.android.apps.maps");
          if (mapIntent.resolveActivity(getPackageManager()) != null) {
            startActivity(mapIntent);
          }
          display("F Yeah M Fker");
        } catch (Exception e) {
          display("No Luck Today");
          display(e.toString());
        }
      }else{
        display("App still in Background");
      }
    }

    //TODO Turn Speaker on
    //Try this:

    //Headsethook for Play/Pause and Accept and End call
    else if (message.charAt(7) == '5') {

      TelecomManager tm = (TelecomManager) this
              .getSystemService(Context.TELECOM_SERVICE);

      //Check for incomming Call and Accept if Button is Pressed
      switch (phoneState) {
        case TelephonyManager.CALL_STATE_RINGING:
          display("Ringing");
          if (tm == null) {
            // whether you want to handle this is up to you really
            throw new NullPointerException("tm == null");
          }
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            tm.acceptRingingCall();
            audio.setSpeakerphoneOn(true);

          }

          break;

        //Ansatz gleich: Bringe App in Vordergrund und Incect Decline Call
        case TelephonyManager.CALL_STATE_OFFHOOK:
          display("OffHook");

          if (tm == null) {
            // whether you want to handle this is up to you really
            throw new NullPointerException("tm == null");
          }
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
              tm.endCall();

            }
          }
          break;

        case TelephonyManager.CALL_STATE_IDLE:
        default:
          display("Phone is Idle");
          if (audio.isMusicActive()) {
            //audio.requestAudioFocus(null,AudioManager.STREAM_MUSIC,AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
            KeyEvent event = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PAUSE);
            audio.dispatchMediaKeyEvent(event);
            display("Pause Music");

          } else {
            //audio.abandonAudioFocus(null);
            KeyEvent event = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PLAY);
            audio.dispatchMediaKeyEvent(event);
            display("Play Music");
          }
          break;
      }
    }
    //Back
    else if(message.charAt(7) == '6'){
      KeyEvent event = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PREVIOUS);
      audio.dispatchMediaKeyEvent(event);
      display("Previous Track");
    }
    //Foreward
    else if(message.charAt(7) == '7'){
      if(phoneState == TelephonyManager.CALL_STATE_RINGING){
        display("Phone is ringing");
        TelecomManager tm = (TelecomManager) this
                .getSystemService(Context.TELECOM_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          tm.endCall();
          display("Decline Call");
        }
      }else{
        KeyEvent event = new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT);
        audio.dispatchMediaKeyEvent(event);
        display("Foreward");
      }
    }

  }

//  Bridge


  //  Backend code place end
  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            new MainActivityDelegate(this, getMainComponentName())
    );
  }

  /**
   * Align the back button behavior with Android S
   * where moving root activities to background instead of finishing activities.
   * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
   */
  @Override
  public void invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        // For non-root activities, use the default implementation to finish them.
        super.invokeDefaultOnBackPressed();
      }
      return;
    }

    // Use the default back button implementation on Android S
    // because it's doing more than {@link Activity#moveTaskToBack} in fact.
    super.invokeDefaultOnBackPressed();
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}

