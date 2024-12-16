pipeline {
    agent any
 
    environment {
        // Define environment variables for AWS ECR and ECS
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = 'sit/lifewater/backend'
        IMAGE_NAME = 'sit/lifewater/backend'
        AWS_CREDENTIALS_ID = '2157424a-b8a7-45c0-90c2-bc0d407f6cea'
        AWS_ACCOUNT_ID = '654654462146' // Add your AWS account ID here
        SONARQUBE_PROJECT_KEY = 'sit-lifewater-backend'
        SONARQUBE_SCANNER_CREDENTIALS_ID = '4fc8a937-028f-43fc-bb14-becd5498bfd3' // Jenkins credentials ID for SonarQube token
        ECS_CLUSTER_NAME = 'sit-lifewater' // Replace with your ECS cluster name
        ECS_SERVICE_NAME = 'sit-lifewater-backend' // Replace with your ECS service name
        ECS_TASK_DEFINITION_NAME = 'sit-lifewater-backend' // Replace with your ECS task definition name
    }
 
    stages {
        stage('SonarQube Analysis') {
            steps {
                script {
                    // Set up SonarQube Scanner
                    scannerHome = tool 'sonarqube' // Replace with your SonarQube Scanner tool name
                }
                withSonarQubeEnv('APIND_Sonarqube') { // Replace with your SonarQube server name
                    // Use the SonarQube Scanner
                    withCredentials([string(credentialsId: "${SONARQUBE_SCANNER_CREDENTIALS_ID}", variable: 'SONAR_TOKEN')]) {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${SONARQUBE_PROJECT_KEY} -Dsonar.sources=. -Dsonar.login=${SONAR_TOKEN}"
                    }
                }
            }
        }
         stage('Dependency-Check Analysis') {
    steps {
        script {
            dependencyCheck additionalArguments: '-f HTML', 
                            odcInstallation: 'Dependency-Check', // Ensure this name matches the configuration in Global Tool Configuration
                            outdir: 'dependency-check-report', 
                              scanpath: '.'
                }
            }
        }
        
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
                archiveArtifacts artifacts: 'trivyfs.txt', fingerprint: true
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('TRIVY Image Scan') {
            steps {
                sh "trivy image ${IMAGE_NAME}:latest > trivyimage.txt"
                archiveArtifacts artifacts: 'trivyimage.txt', fingerprint: true
            }
        }
 
        stage('Login to ECR') {
            steps {
                script {
                    // Authenticate Docker to the AWS ECR
                    withAWS(credentials: "${AWS_CREDENTIALS_ID}", region: "${AWS_REGION}") {
                        sh '''
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        '''
                    }
                }
            }
        }
 
        stage('Push Docker Image') {
            steps {
                script {
                    // Tag and push Docker image to ECR
                    sh 'docker tag $IMAGE_NAME:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest'
                    sh 'docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest'
                }
            }
        }
 
        stage('Update ECS Service') {
            steps {
                script {
                    withAWS(credentials: "${AWS_CREDENTIALS_ID}", region: "${AWS_REGION}") {
                        sh '''
                            # Fetch the latest task definition revision
                            LATEST_TASK_DEFINITION=$(aws ecs describe-task-definition \
                                --region ${AWS_REGION} \
                                --task-definition ${ECS_TASK_DEFINITION_NAME} \
                                --query 'taskDefinition.taskDefinitionArn' \
                                --output text)
 
                            # Check if the task definition was fetched successfully
                            if [ -z "$LATEST_TASK_DEFINITION" ]; then
                                echo "Error: Could not fetch the task definition ARN."
                                exit 1
                            fi
 
                            # Update ECS Service to use the latest task definition
                            aws ecs update-service \
                                --region ${AWS_REGION} \
                                --cluster ${ECS_CLUSTER_NAME} \
                                --service ${ECS_SERVICE_NAME} \
                                --force-new-deployment \
                                --task-definition ${LATEST_TASK_DEFINITION}
                        '''
                    }
                }
            }
        }
    }
 
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
